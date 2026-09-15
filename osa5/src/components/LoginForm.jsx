const LoginForm = ({ propsObject }) => {
    console.log('username_:', propsObject.username_, 'password_:', propsObject.password_)
    return (
        <>
            <h3>log in to application</h3>
            <form onSubmit={propsObject.handleLogin_}>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={propsObject.username_}
                            onChange={({ target }) => propsObject.setUsername_(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={propsObject.password_}
                            onChange={({ target }) => propsObject.setPassword_(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">login</button>
            </form>
        </>
    )
}
export default LoginForm