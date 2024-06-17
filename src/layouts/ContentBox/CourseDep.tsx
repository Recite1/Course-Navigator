import './ContentBox.css'
import {Course} from '../../Interfaces'
import {useEffect , useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {Tooltip} from '@mui/material'

function CourseDep({selectedCourse}:{ selectedCourse: Course | undefined }){
    
    const navigate = useNavigate();

    const handleSearch = (e : Course) => {
        navigate(`/course/${e.code}`);
    };
    const [depnCourseList , setCourseList] = useState<Course[]>([]);
    useEffect(() => {
        const fetchCourse = async () => {

            if (selectedCourse !== undefined) {
                let newDepnCourseList: Course[] = [];
                selectedCourse.depn.forEach( async (item) => {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/course/${item}`);
                    const recievedCourse = await response.json() as Course;
                    newDepnCourseList = [...newDepnCourseList, recievedCourse];
                    setCourseList(newDepnCourseList);
                });
            }

        }

        fetchCourse();

      }, [selectedCourse]);


    return <div className = "ContentBox-Container">
        
        {selectedCourse !== undefined && selectedCourse.depn !== null  && (
            depnCourseList.map((item , index)=> (
                <div key = {index} className = "subBox" onClick={() => handleSearch(item)}> 
                        <div className = "item-code">{item.code}</div>
                        <Tooltip title = "click here to see the course on carleton's website" >
                            <a href = {item.link} target="_blank" className = "item-link" onClick = {(e) =>e.stopPropagation()}><div>{item.name}</div></a>
                        </Tooltip>
                        <div className = "subBox-description">{item.description} </div>
                        <div> Credits: {String(item.credit)} </div>
                </div>
            ))
        )}
    </div>
}

export default CourseDep;