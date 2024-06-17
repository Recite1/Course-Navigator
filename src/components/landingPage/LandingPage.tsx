import { useState , useEffect, Fragment} from 'react'
import { useParams } from 'react-router-dom';
import Header from '../Header/Header'
import InfoBox from '../../layouts/InfoBox/InfoBox'
import CourseInfo from '../../layouts/ContentBox/CourseInfo'
import CoursePreq from '../../layouts/ContentBox/CoursePreq'
import CourseDep from '../../layouts/ContentBox/CourseDep'
import {Course} from '../../Interfaces'
import './LandingPage.css'

function LandingPage(){
    
    let { courseCode } = useParams();
    const [recievedCourse, setCourse] = useState<Course | undefined>(undefined);
    
    useEffect(() => {
        const fetchCourse = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/course/${courseCode}`);
            if(response.status != 204){
                const recievedCourse = await response.json() as Course;
                setCourse(recievedCourse);
            } else {
                setCourse(undefined);
            }
        }
        if (courseCode !== undefined) fetchCourse();
    } , [courseCode]);

    return(
        <Fragment>
            <Header></Header>
            <div className = "content-container">
                <div className = "content-sub-container">
                    <InfoBox title = "Course Information" info = "Enter the course code using the search tool above. Eg: 'COMP 1405'"></InfoBox>
                    <CourseInfo selectedCourse = {recievedCourse}></CourseInfo>
                </div>
                <div className = "content-sub-container">
                    <InfoBox title = "Prerequisites" info = "Selected course's prerequisites"></InfoBox>
                    <CoursePreq selectedCourse = {recievedCourse} ></CoursePreq>
                </div>
                <div className = "content-sub-container">
                    <InfoBox title = "Dependent Courses" info = "Courses that list this course as a direct prerequisite"></InfoBox>
                    <CourseDep selectedCourse = {recievedCourse} />
                </div>
            </div>
        </Fragment>
    )
}

export default LandingPage;