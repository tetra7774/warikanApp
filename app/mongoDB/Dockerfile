# set up the container.
FROM arm64v8/mongo:7.0-rc

# set utf-8 encoding and the root user's password.
ENV LANG=ja_JP.UTF-8
# copy the init js file to the init dir.
COPY init_db.js /docker-entrypoint-initdb.d/


# expose the port.
EXPOSE 27017
