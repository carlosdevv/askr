import { FiCopy } from 'react-icons/fi'

import './styles.scss'

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <FiCopy color='#fff' size={20} />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}