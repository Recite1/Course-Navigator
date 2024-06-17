from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from bs4 import BeautifulSoup
import re
from sqlalchemy import create_engine, Column, Integer, String, Text, ARRAY, Numeric
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
database_url = os.getenv('DATABASE_URL')
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--window-size=1250,1000")

driver = webdriver.Chrome(
    options=chrome_options)

engine = create_engine(database_url)
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()


class courses(Base):
    __tablename__ = "courses"

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String)
    description = Column("description", String)
    code = Column("code", String)
    link = Column("link", Text)
    preq = Column("preq", ARRAY(Text), nullable=True)
    preq_message = Column("preq_message", String)
    depn = Column("depn", ARRAY(Text), nullable=True)
    credit = Column("credit", Numeric(3, 2))

    def __init__(self, name, description, code, link, preq, preq_message, depn, credit):
        self.name = name
        self.description = description
        self.code = code
        self.link = link
        self.preq = preq
        self.preq_message = preq_message
        self.depn = depn
        self.credit = credit

    def __repr__(self):
        return f"({self.name})({self.description}) ({self.code})({self.link})({self.preq})({self.preq_message})({self.depn})({self.credit})"


if __name__ == '__main__':
    driver.get("https://calendar.carleton.ca/undergrad/courses/")
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    element = soup.find("div", class_="course")
    a_tags_within_div = element.find_all("a")
    course_block = []
    for l in a_tags_within_div:
        href = l.get("href")
        if href == "/undergrad/courses/acse/":
            driver.get(
                f"https://calendar.carleton.ca{href}")
        else:
            driver.get(
                f"https://calendar.carleton.ca/undergrad/courses/{href}")
        soup = BeautifulSoup(driver.page_source.encode('ascii', 'ignore').decode(
            'ascii'), 'html.parser')
        course_block.extend(soup.find_all("div", class_="courseblock"))

    def FindCourseCode(html):
        course_code = html.find("span", class_="courseblockcode")
        course_code_text = course_code.text
        return course_code_text

    def FindAllCoursePreq(html):
        prerequisite_tag = html.find(
            string=lambda text: text and "Prerequisite(s): " in text)
        tempPreq = None
        if prerequisite_tag:
            all_prerequisite = prerequisite_tag.find_all_next("a")
            if all_prerequisite != []:
                tempPreq = []
                for j in all_prerequisite:
                    tempPreq.append(j.text)

        return tempPreq

    def FindPreqMessage(html):
        pattern = r'Prerequisite\(s\):\s(.*?)Lecture'
        matches = re.search(pattern, html.text.replace(
            "\xa0", " "))
        if not matches:
            newPattern = r'Prerequisite\(s\):\s(.*?)\.'
            matches = re.search(newPattern, html.text.replace(
                "\xa0", " "))
            if not matches:
                matches = None
                return matches

        return matches.group(1)

    def FindCourseName(html):
        course_name = html.find("span", class_="courseblocktitle")
        pattern = r'\][\s\S](.+)$'
        matches = re.search(pattern, course_name.text)
        return matches.group(1)

    def FindCredit(html):
        course_credit = html.find("span", class_="courseblocktitle")
        pattern = r'\[(\d+\.\d+) credits?\]'
        matches = re.search(pattern, course_credit.text)
        return matches.group(1)

    def FindDescription(html):
        pattern = r'.+?\n.+?\n(.+?)\n'
        matches = re.search(pattern, html.text)
        if matches:
            return matches.group(1)
        else:
            return None

    courses_info = []
    all_course_depn = {}

    for i in course_block:
        courseBlock = BeautifulSoup(
            f"{i}".replace(u"\xa0", " ").replace("\u202f", " "), 'html.parser')

        course_code = FindCourseCode(courseBlock)
        course_name = FindCourseName(courseBlock)
        course_credit = FindCredit(courseBlock)
        preq = FindAllCoursePreq(courseBlock)
        preq_message = FindPreqMessage(courseBlock)
        link = "https://calendar.carleton.ca/search/?P=COMP%20" + \
            course_code[-4:]
        description = FindDescription(courseBlock)
        if preq:
            for p in preq:
                all_course_depn.setdefault(p, []).append(course_code)

        courses_info.append(
            {"name": course_name, "preq": preq, "preq_message": preq_message, "code": course_code, "credit": course_credit, "link": link, "description": description})

    for a in courses_info:
        a.setdefault("depn", all_course_depn.setdefault(a["code"], None))

        newCourse = courses(
            name=a["name"],
            description=a["description"],
            code=a["code"],
            link=a["link"],
            preq=a["preq"],
            preq_message=a["preq_message"],
            credit=float(a["credit"]),
            depn=a["depn"]
        )

        session.add(newCourse)
        session.commit()
"""
with open("backend/output.txt", "w") as file:
    for k in courses_info:
        file.write(f"{k}\n")
"""
