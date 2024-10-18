

const FollowerCard = (props) => {
    const follower = props.props
    console.log(follower.followingData)
    console.log(follower)

    return (
        <div>
            <h1>
                {follower.username}
            </h1>
            <img src={follower.profilePictureURL}/>
            <h3>followers</h3>
            <h4>{follower.followingData.followers.length}</h4>
            <h3>following</h3>
            <h4>{follower.followingData.following.length}</h4>
        </div>
    )
}

export default FollowerCard