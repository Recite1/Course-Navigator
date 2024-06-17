import './InfoBox.css'

function InfoBox({ title, info }: { title: string; info: string }){
    return <div className = "InfoBox-Container">
        <span> {title} </span>
        <p> {info} </p>
    </div>
}

export default InfoBox;