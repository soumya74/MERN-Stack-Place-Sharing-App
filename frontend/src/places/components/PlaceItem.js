import React, { useState, useContext } from 'react';
import {useParams, useHistory} from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import {AuthContext} from '../../shared/components/context/auth-context'
import {useHttpClient} from '../../shared/components/hooks/http-hook'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import './PlaceItem.css';

const PlaceItem = props => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const history = useHistory()
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const openConfirmModal = () => setShowConfirmModal(true);

  const closeConfirmModal = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async (event) => {
    event.preventDefault()
    setShowConfirmModal(false)

    try{
      const responseData = await sendRequest(`http://localhost:5000/api/places/${props.id}`,'DELETE')
      history.push('/')
    } catch(err){
      console.log(err)
    }

    console.log("DELETING ...")
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay/>}
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <h2>THE MAP!</h2>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        header="Are you sure ?"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-content"
        onCancel={closeConfirmModal}
        footer={
          <React.Fragment>
            <Button inverse onClick={closeConfirmModal}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>YES, SURE</Button>
          </React.Fragment>
        }>
        <p>Are you sure ? You want to delete ?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            { auth.isLoggedIn && auth.userId===props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
            { auth.isLoggedIn && auth.userId===props.creatorId && <Button danger onClick={openConfirmModal}>DELETE</Button>}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
