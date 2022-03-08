import { useState } from "react"

const StudentAdd = ({ url }) => {
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [course, setCourse] = useState('')

    const addStudent = (e) => {
        e.preventDefault()
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                number: number,
                course: course,
            })
        };

        fetch(url + 'newStudent', settings)
        .then((resp) => console.log(resp.body))
        .catch((e) => console.log(e))
    }

    return (
        <form onSubmit={addStudent} method="post">
            <div>
                <label>name</label>
                <input 
                    type="text" 
                    placeholder="add name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            </div>
            <div>
                <label>number</label>
                <input 
                    type="text" 
                    placeholder="add number" 
                    value={number} 
                    onChange={(e) => setNumber(e.target.value)}
                />
            </div>
            <div>
                <label>course</label>
                <input 
                    type="text" 
                    placeholder="add course" 
                    value={course} 
                    onChange={(e) => setCourse(e.target.value)}
                />
            </div>

            <input type="submit" value="Add Student" />
        </form>
    )
}

export default StudentAdd