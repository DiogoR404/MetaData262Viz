import { useEffect, useState, useCallback } from "react";

const StudentSearch = ({ url }) => {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState({});

  useEffect(() => {
    if (studentId === '') return

    setStudent({})
    fetch(url + 'student/' + studentId)
      .then((resp) => resp.json())
      .then((result) => {
        setStudent(result);
        console.log(result);
        console.log(student)
      })
      .catch((e) => console.log(e))

  }, [studentId])

  const keyPress = useCallback((e) => {
    if (e.keyCode === 13) {
      setStudentId(e?.target?.value)
    }
  }, [])

  return (
    <>
      <input
        type="search"
        onKeyDown={keyPress}
        placeholder="search student id"
      />

      {student.name !== '' &&
        <div>
          <span>{student.name}</span>
          <span>{student.number}</span>
          <span>{student.course}</span>
        </div>
      }
    </>
  )
}

export default StudentSearch