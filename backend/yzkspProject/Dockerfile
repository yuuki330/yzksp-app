FROM python:3.9

# set environment variables
ENV PYTHONUNBUFFERED 1
#ENV DEBUG 0

# set work directory
WORKDIR /app

RUN pip install --upgrade pip

# install dependencies
COPY ./requirements.txt .
#RUN pip install -r requirements.txt
RUN pip install --default-timeout=100 -r requirements.txt
# copy project
COPY . .

# # run migrations
# RUN python manage.py makemigrations
# RUN python manage.py migrate

# 環境変数を設定
ENV RUNNING_IN_DOCKER=true

# run gunicorn
CMD python manage.py runserver 0.0.0.0:8000
