FROM sitespeedio/node:ubuntu-20.04-nodejs-12.14.1

RUN apt-get update

RUN apt-get install -y \
    p7zip-full locales locales-all

RUN locale-gen zh_TW.UTF-8  
ENV LC_ALL=zh_TW.UTF-8
ENV LC_LAGNlo=zh_TW.UTF-8
RUN echo "export LANG=zh_TW.UTF-8" >> /etc/profile

# COPY package.json /
# RUN npm install

RUN localedef -c -f UTF-8 -i zh_TW zh_TW.utf8

CMD ["bash"]

RUN apt-get install -y unzip
RUN npm install mime excel4node