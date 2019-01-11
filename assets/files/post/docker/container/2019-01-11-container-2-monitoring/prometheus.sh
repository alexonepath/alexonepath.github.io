#!/bin/bash

Green='\033[0;32m'
Yellow='\033[1;33m'
RED='\033[031m'
NC='\033[0m'

PROMETHEUS_SERVER_CONTAINER_NAME="prometheus-server"
PROMETHEUS_EXPORTER_CONTAINER_NAME="prometheus-exporter"
PROMETHEUS_GRAFANA_CONTAINER_NAME="prometheus-grafana"

ROOT_DIR=/data/repositories/docker-repository
PROMETHEUS_SERVER_DIR=${ROOT_DIR}/prometheus-server
PROMETHEUS_EXPORTER_DIR=${ROOT_DIR}/prometheus-exporter
PROMETHEUS_GRAFANA_DIR=${ROOT_DIR}/prometheus-grafana

PROMETHEUS_SERVER_PORT=30001
PROMETHEUS_GRAFANA_PORT=30000
PROMETHEUS_GRAFANA_ADMIN_PWD=tjdwhdwjs!

# Remote node list #
REMOTE_USER="soul"
# ("server_ip1@container_mapping_port" "server_ip2@container_mapping_port")
REMOTE_LIST=("javaweb.iptime.org@30002")

runRemote(){
    IDX=0
    for remote in "${REMOTE_LIST[@]}"
    do
        IDX=$((IDX+1))

        IP_PORT=(${remote//@/ })
        echo -e "${Green}Run remote (${IDX}/${#REMOTE_LIST[@]})${NC}"

        ssh -o "StrictHostKeyChecking no" ${REMOTE_USER}@${IP_PORT[0]} docker rm -f ${PROMETHEUS_EXPORTER_CONTAINER_NAME}
        ssh -o "StrictHostKeyChecking no" ${REMOTE_USER}@${IP_PORT[0]} sudo rm -rf ${PROMETHEUS_EXPORTER_DIR}
        ssh -o "StrictHostKeyChecking no" ${REMOTE_USER}@${IP_PORT[0]} sudo mkdir -p ${PROMETHEUS_EXPORTER_DIR}
        ssh -o "StrictHostKeyChecking no" ${REMOTE_USER}@${IP_PORT[0]} sudo chmod 777 ${PROMETHEUS_EXPORTER_DIR}

        docker run -d --name ${PROMETHEUS_EXPORTER_CONTAINER_NAME} \
        --restart=always \
        -v /etc/localtime:/etc/localtime:ro \
        -p ${IP_PORT[1]}:9100 \
        prom/node-exporter

        echo -e "${Green}Done. (${IDX}/${#REMOTE_LIST[@]})${NC}"
    done
}

runServer(){
    echo -e "${Green}Run server${NC}"

    echo -e "${Yellow}Clear${NC}"
    # Clear prometheus server
    docker rm -f ${PROMETHEUS_SERVER_CONTAINER_NAME}
    sudo rm -rf ${PROMETHEUS_SERVER_DIR}
    mkdir -p ${PROMETHEUS_SERVER_DIR}
    chmod 777 ${PROMETHEUS_SERVER_DIR}

    # Clear grafana
    docker rm -f ${PROMETHEUS_GRAFANA_CONTAINER_NAME}
    sudo rm -rf ${PROMETHEUS_GRAFANA_DIR}
    mkdir -p ${PROMETHEUS_SERVER_DIR}/conf
    cp prometheus.yml ${PROMETHEUS_SERVER_DIR}/conf

    # Run prometheus-server (conf location : /etc/prometheus/prometheus.yml)
    docker run -d --name ${PROMETHEUS_SERVER_CONTAINER_NAME} \
    --restart=always \
    -p ${PROMETHEUS_SERVER_PORT}:9090 \
    -v /etc/localtime:/etc/localtime:ro \
    -v ${PROMETHEUS_SERVER_DIR}:/prometheus \
    -v ${PROMETHEUS_SERVER_DIR}/conf/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus

    # Run grafana (conf location : /etc/grafana/grafana.ini)
    docker run -d --name ${PROMETHEUS_GRAFANA_CONTAINER_NAME} \
    --restart=always \
    -u $(id -u root):$(id -g root) \
    -p ${PROMETHEUS_GRAFANA_PORT}:3000 \
    -v /etc/localtime:/etc/localtime:ro \
    -v ${PROMETHEUS_GRAFANA_DIR}/data:/var/lib/grafana \
    -e "GF_SERVER_ROOT_URL=http://javaweb.iptime.org" \
    -e "GF_SECURITY_ADMIN_PASSWORD=${PROMETHEUS_GRAFANA_ADMIN_PWD}" \
    -e "GF_SMTP_SKIP_VERITY=true" \
    -e "GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource,grafana-piechart-panel" \
    grafana/grafana:5.4.2

    echo -e "${Green}Done."
}

runRemote
echo -e "\n"
runServer