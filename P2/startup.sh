python3 -m pip install virtualenv
python3 -m virtualenv venv
python3 ../venv/Scripts/activate
pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate