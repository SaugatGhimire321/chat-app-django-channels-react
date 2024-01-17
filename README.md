### Create django project with custom user and readymade authenticated url

##### Clone this project
```sh
git@github.com:SaugatGhimire321/chat-app-django-channels-react.git
```
##### or
```sh
https://github.com/SaugatGhimire321/chat-app-django-channels-react.git
```

##### Go to the project's root folder
```sh
cd ./chat-app-django-channels-react
```

##### Create virtual Environment
```sh
python3 -m venv .venv
```

##### Activate virtual Environment
```sh
source .venv/bin/activate 
```

##### Install pip-tools
```sh
pip install pip-tools
```

##### Install requirements
```sh
pip-sync ./requirements/dev.txt
```

Copy env.sample.py file and create env.py with its content inside settings folder config folder

Change the database name, user and secret key in the env.py file

 
##### Migrate model to database
go inside project folder and make sure environment is activated
```sh
python manage.py migrate
```

##### Create superuser
```sh
python manage.py createsuperuser
```
fill all inputs to create superuser

##### Run Server
```sh
python manage.py runserver
```

### For frontend

##### Go to the react app's root folder
```sh
cd ./frontend
```

##### Install all the dependencies
```sh
npm install
```

##### Start React app
```sh
npm run dev
```
