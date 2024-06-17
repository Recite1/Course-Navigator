import "./SearchResults.css"
import { useNavigate } from 'react-router-dom';
import {Course} from "../../../Interfaces"

function SearchResults({results} : {results : Course[] | undefined}){
    const navigate = useNavigate()
    return <div className= "results-container">
        {results !== undefined ? (
            results.map((item,index) => (
                <div className = "results-container-items" onMouseDown = {() => navigate(`/course/${item.code}`)}key = {index} >{item.code}</div>
            ))
        ) : (
            <div className = "results-container-items"> No Course Found </div>
        )}
    </div>
}

export default SearchResults