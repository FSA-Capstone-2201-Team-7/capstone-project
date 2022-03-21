import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

const SingleItem = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    // console.log(params);
    getItem();
  }, []);

  const getItem = async () => {
    try {
      setLoading(true);
      let { data, error, status } = await supabase
        .from('items')
        .select(`*, users(username)`)
        .eq('id', params.id);
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setItem(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="single-item-container">
          <p>{item.name}</p>
          <p>Owner: {item.users.username}</p>
          <p>{item.description}</p>
          <img src={item.image_url} alt="" />
        </div>
      )}
    </div>
  );
};

export default SingleItem;