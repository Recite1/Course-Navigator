import psycopg2
import json
from flask import Flask, request, jsonify, abort, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import ARRAY
from dotenv import load_dotenv
import os

load_dotenv()
database_url = os.getenv('DATABASE_URL')
fontend_url = os.getenv('FRONTEND_URL')
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
db = SQLAlchemy(app)
CORS(app, origins=[fontend_url])


class courses(db.Model):
    preq = db.Column(ARRAY(db.Text))
    depn = db.Column(ARRAY(db.Text))
    code = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    credit = db.Column(db.Numeric(3, 2), nullable=False)
    link = db.Column(db.Text, nullable=True)
    name = db.Column(db.String, nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    preq_message = db.Column(db.String, nullable=True)

    def __repr__(self):
        return f'"preq": {self.preq}, "depn": {self.depn}, "code":{self.code}'


def format_courses(e):
    return {
        "preq": e.preq,
        "depn": e.depn,
        "code": e.code,
        "description": e.description,
        "credit": float(e.credit),
        "link": e.link,
        "name": e.name,
        "preq_message": e.preq_message
    }


@app.route('/')
def index():
    return f'{{"message" : "Server is running"}}'


@app.route('/course/<code>')
def getCourse(code):
    targetCourse = courses.query.filter_by(code=code.upper()).first()
    if targetCourse:
        return f"{json.dumps(format_courses(targetCourse))}"
    else:
        data = {'data': 'undefined'}
        return jsonify(data), 204


@app.route('/getList/<code>')
def getCourseList(code):
    target_course = courses.query.filter(
        courses.code.like(f'{code.upper()}%')).limit(8).all()

    course_list = []
    for course in target_course:
        course_list.append(format_courses(course))

    if course_list != []:
        return jsonify(course_list), 200
    else:
        return jsonify(course_list), 204


@app.route('/getList/')
def getEmptyCourseList():
    response = make_response('')
    response.status_code = 204
    return response


@app.route('/getAllCourses')
def getAllCourses():
    coursese = courses.query.all()
    course_list = []
    for course in coursese:
        course_list.append(format_courses(course))
    return jsonify(course_list), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1111, debug=True)
