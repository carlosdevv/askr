import { useParams } from "react-router";
import { Toaster } from "react-hot-toast";
import { database } from "../../services/firebase";
import { useHistory } from "react-router-dom";

import { Button } from "../../components/Button";
import { RoomCode } from "../../components/RoomCode";
import { Question } from "../../components/Question";
import { useRoom } from "../../hooks/useRoom";

import './styles.scss'
import logoImg from '../../assets/images/logo.svg'
import removeImg from '../../assets/images/remove.svg'
import messageImg from '../../assets/images/message.svg'
import checkImg from '../../assets/images/check.svg'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user, signInWithGoogle } = useAuth()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const history = useHistory()

  const { questions, title } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  function handleGoToAskRoom() {
    history.push(`/rooms/${roomId}`)
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuesitonAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })

  }
  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    if (isHighlighted === false) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      })
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false,
      })
    }
  }

  return (
    <div id="page-room">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <header>
        <div className="content">
          <img src={logoImg} alt="Askr" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleGoToAskRoom}>Enviar Perguntas</Button>
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>



        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuesitonAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                    >
                      <img src={messageImg} alt="Dar destaque à Pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={removeImg} alt="Remover Pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>


    </div>
  )
}


