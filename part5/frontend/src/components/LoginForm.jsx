const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <h2>log in to application</h2>
    <div>
      username
      <input
        type="text"
        value={username}
        name="Username"
        placeholder="username"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      password
      <input
        type="password"
        value={password}
        name="Password"
        placeholder="password"
        onChange={handlePasswordChange}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

export default LoginForm
