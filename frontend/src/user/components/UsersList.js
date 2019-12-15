import React from 'react';

import './UsersList.css';
import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card'

const UserList = (props) => {
    if(props.items.length === 0){
        return (
            <div className="centre">
                <Card>
                    No Users Found
                </Card>
            </div>
        );
    }

    // Instead we can send the entire user object as well to UserItem
    return (
        <ul className="users-list">
            {props.items.map( user =>(
            <UserItem 
                key={user.id}
                id={user.id} 
                image={user.image} 
                name={user.name} 
                placeCount={user.places.length} />
            )
            )}
        </ul>
    );
}

export default UserList;