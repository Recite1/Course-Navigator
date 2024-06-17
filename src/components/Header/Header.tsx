import './Header.css'
import { KeyboardEvent , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchResults from './SearchResults/SearchResults';
import {Course} from '../../Interfaces'
import debounce from 'lodash/debounce';
import Popover from '@mui/material/Popover';

function Header(){
    const navigate = useNavigate();
    const [results , setResults ] = useState<Course[] | undefined>(undefined);
    const [displayResults , setDisplayResults ] = useState(false);
    const [popover , setPopover ] = useState(false);

    const handleSearch = (e: KeyboardEvent<HTMLInputElement> ) => {
        if (e.key === 'Enter') {
            navigate(`/course/${e.currentTarget.value}`);
        }
    };
    
    const handleSearchChange = debounce((e: string) => {
        fetch(`${import.meta.env.VITE_API_URL}/getList/${e}`)
            .then((response) => {
                if (response.status === 204) {
                    setResults(undefined)
                } else {
                    return response.json();
                }
            })
            .then((json) => {
                setResults(json);
            })
    } , 500 );

    return(
        <div className = "Header">
            <div className = "logo"> Carleton Course Search </div>
            <div className = "search-contents">
                <input id = "search" className = "courseSearch" 
                    onKeyDown={handleSearch} 
                    onChange = {(e) => handleSearchChange(e.target.value)} 
                    onFocus={ () => (setDisplayResults(true))}
                    onBlur={ () => (setDisplayResults(false))}
                    autoComplete ="off"
                />
                
                {displayResults  && <SearchResults  results = {results}></SearchResults>}
            </div>

            <img id = "info-button"  data-popovertarget = "info"className = "info-circle" src ="/info-circle-fill.svg" onClick = {() => setPopover(true)}></img>
            <Popover 
                id= "popover"
                anchorEl= {document.getElementById('info-button')}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={popover}
                onClose = {() => setPopover(false)}
                
            >
                <div className="popover-content">
                    <p>API: /getAllCourses</p>
                </div>
            </Popover>
        </div>
    )


    
}

export default Header;