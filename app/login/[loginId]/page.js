


export default function page({ params }){
    return (
        <div>
            Login Id: {params.loginId}
            <h1>Please return to login <a href="/login">Login</a></h1>
        </div>
    )
}