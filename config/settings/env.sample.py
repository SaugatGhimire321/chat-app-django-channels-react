from .base import *

INSTALLED_APPS += (
    'debug_toolbar',
    'drf_yasg',
    'django_extensions'
)

MIDDLEWARE += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

INTERNAL_IPS = ['127.0.0.1', ]

ALLOWED_HOSTS = ['*']

CORS_ORIGIN_ALLOW_ALL = True

# Database for postgres
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': "chatapp",
        'USER': "saugat",
        'PASSWORD': "hellonepal",
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

SECRET_KEY = 'w=2%0_pvo+k3#%-0q!4*)q54!3pm*!&%!hm&@3yr1)6m)85dqg'