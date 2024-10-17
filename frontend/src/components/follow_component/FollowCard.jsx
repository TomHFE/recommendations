


const FollowCard = (follow) => {

    return (
        <div>
            <h1>
                {follow.username}
            </h1>
            <img src={follow.profilePictureURL}/>
            <h3>followers</h3>
            <h4>{follow.followingData.followers.length}</h4>
            <h3>following</h3>
            <h4>{follow.followingData.following.length}</h4>
        </div>
    )
}

export default FollowCard