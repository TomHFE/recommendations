

const FollowerCard = (follower) => {

    return (
        <div>
            <h1>
                {follower.username}
            </h1>
            <img src={follower.profilePictureURL}/>
            <h3>followers</h3>
            <h4>{follower.followeringData.followerers.length}</h4>
            <h3>following</h3>
            <h4>{follower.followeringData.followering.length}</h4>
        </div>
    )
}

export default FollowerCard