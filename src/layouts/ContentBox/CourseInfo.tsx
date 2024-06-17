import './ContentBox.css'
import {Course} from '../../Interfaces'

function ContentInfo({selectedCourse}:{ selectedCourse: Course | undefined }){

    return <div className = "ContentBox-Container">
        <div className = "subBox">
            <span className = "subBox-title" >Selected Course: </span>
            {selectedCourse === undefined ? "No course selected !!" : <div>{selectedCourse.name} <span className = "course-text">({selectedCourse.code}) </span> </div>}
        </div>
        <div className = "subBox">
            <span className = "subBox-title" > Description: </span>
            {selectedCourse === undefined ? "" : <div>{selectedCourse.description}</div>}
        </div>
        <div className = "subBox">
            <span className = "subBox-title" > Credits: </span>
            {selectedCourse === undefined ? "" : <div className = "subBox-content">{String(selectedCourse.credit)}</div>}
        </div>
        <div className = "subBox">
            <span className = "subBox-title" style = {{height: '250px'}}> Reviews: </span>
        </div>
    </div>
}

export default ContentInfo;