FROM php:7.4-fpm

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        libicu-dev \
        libpq-dev \
        libxpm-dev \
        libvpx-dev \
        libzip-dev \
        ;

RUN apt-get update && apt-get install -y \
        librabbitmq-dev \
        libssh-dev \
    && docker-php-ext-install \
        bcmath \
        sockets \
    && pecl install amqp \
    && docker-php-ext-enable amqp

#RUN pecl install xdebug \
#    && docker-php-ext-enable xdebug \
#    ;

RUN docker-php-ext-install -j$(nproc) intl \
    && docker-php-ext-install -j$(nproc) zip \
    && docker-php-ext-install -j$(nproc) pgsql \
    && docker-php-ext-install -j$(nproc) pdo_pgsql \
    && docker-php-ext-install -j$(nproc) exif \
    ;

RUN docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-configure gd \
        # usage for php >=7.4
        --with-freetype --with-jpeg \
        # usage for php <=7.3
        #--with-freetype-dir=/usr/include/ \
        #--with-jpeg-dir=/usr/include/ \
        #--with-xpm-dir=/usr/lib/x86_64-linux-gnu/ \
        #--with-vpx-dir=/usr/lib/x86_64-linux-gnu/ \
    ;

RUN pecl install mcrypt-1.0.3 \
    && docker-php-ext-enable mcrypt \
    ;