FROM linuxserver/transmission:95
MAINTAINER alexonepath@gmail.com

COPY entrypoint.sh /
RUN chmod +x entrypoint.sh
CMD /entrypoint.sh && /usr/bin/transmission-daemon -g /config -c /watch -f