import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) return null

  const severity = notification.type === 'error' ? 'error' : 'success'

  return (
    <Alert severity={severity} className="notification" sx={{ my: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
