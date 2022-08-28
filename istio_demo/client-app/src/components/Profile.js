import React from 'react'
import Card from 'react-bootstrap/Card';
import { useAuth0 } from '@auth0/auth0-react'

const Profile = () => {

    const { user, isAuthenticated, loginWithRedirect } = useAuth0()
    if(isAuthenticated){
        console.log(user)
    }
    return (
       isAuthenticated ?
        <Card style={{ width: '18rem' , marginTop:'1rem' }}>
          <Card.Body>
            <Card.Title>{user.nickname}</Card.Title>
            <Card.Text>
              {user.email}
            </Card.Text>
          </Card.Body>
        </Card>
        : loginWithRedirect()
      );
}

export default Profile