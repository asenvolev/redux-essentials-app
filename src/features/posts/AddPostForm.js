import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import {addNewPost} from './postsSlice';

export const AddPostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch();

    const users = useSelector(selectAllUsers);

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const userOptions = users.map(user =>(
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ));

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                const result = await dispatch(addNewPost({title,content, user:userId}));
                unwrapResult(result);
                setTitle('');
                setContent('');
                setUserId('');
            } catch (error) {
                console.error('Failed to save the post: ', error);
            }
            finally{
                setAddRequestStatus('idle');
            }
        }
    }

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle"> Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged} 
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged} >
                    <option value=""></option>
                    {userOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                  id="postContent"
                  name="postContent"
                  value={content}
                  onChange={onContentChanged}
                />
            </form>
            <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
        </section>
    )
}