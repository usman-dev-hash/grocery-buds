import React, {useEffect, useState} from 'react';
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
    const list = localStorage.getItem('list');
    if (list){
        return JSON.parse(list);
    }
    else {
        return [];
    }
}

function App(){

    const [name, setName] = useState('');
    const [list, setList] = useState(getLocalStorage);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(0);
    const [alert, setAlert] = useState(
        {
            show: false,
            type: '',
            msg: ''
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name){
            showAlert(true,'danger','please enter value');
        }
        else if (name && isEditing){
            setList(
                list.map((item)=>{
                    if (item.id === editId){
                        return {...item, title: name}
                    }
                    return item;
                })
            )
            setIsEditing(false);
            setEditId(null);
            setName('');
            showAlert(true, 'success', 'item has been updated')
        }
        else {
            let newItems = { id: new Date().getTime().toString(), title: name };
            setList([...list, newItems]);
            setName('');
            showAlert(true,'success','new item added');
        }
    }

    const showAlert = (show=false, type='', msg='') => {
        setAlert({ show, type, msg });
    }

    const clearList = () => {
        showAlert(true, 'danger', 'empty list')
        setList([]);
    }

    const removeItem = (id) => {
        showAlert(true, 'danger', 'item has been removed')
        setList(list.filter( (item) => item.id !== id))
    }

    const editItem = (id) => {
        const specificItem = list.find((item)=>item.id === id);
        setIsEditing(true);
        setEditId(id);
        setName(specificItem.title);
    }

    useEffect(() => {
        localStorage.setItem('list', JSON.stringify(list));
    }, [list])

    return (
        <section className='section-center'>
            <form className='grocery-form' onSubmit={handleSubmit}>
                {alert.show && <Alert {...alert}  removeAlert={showAlert} list={list} />}
                <h3>Grocery bud</h3>
                <div className={'form-control'}>
                    <input type={'text'}
                           value={name}
                           onChange={ (e) => setName(e.target.value) }
                           className={'grocery'}
                           placeholder={'e.g. eggs'}
                    />
                    <button type='submit' className='submit-btn'>{ isEditing ? 'edit' : 'submit' }</button>
                </div>
            </form>
            { list.length > 0 && (
                <div className={'grocery-container'}>
                    <List items={list} removeItem={removeItem} editItem={editItem} />
                    <button className={'clear-btn'} onClick={()=>clearList()}>clear info</button>
                </div>
            ) }
        </section>
    )

}

export default App;