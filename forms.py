from flask_wtf import FlaskForm
from wtforms.fields.html5 import EmailField
from wtforms import PasswordField
from wtforms.validators import DataRequired, Email, EqualTo


# Signup Form created from user_form
class SignupForm(FlaskForm):
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField(
        'Password', validators=[DataRequired(), EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField('Repeat Password')


class LoginForm(FlaskForm):
    email = EmailField('email', validators=[DataRequired(), Email()])
    password = PasswordField('password', validators=[DataRequired()])
