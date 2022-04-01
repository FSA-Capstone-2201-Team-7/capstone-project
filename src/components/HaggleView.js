import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import Chat from './Chat';
import Card from './Card';
import HaggleInventory from './HaggleInventory';

const HaggleView = ({ state }) => {
  const location = useLocation(null);
  const { swap = '' } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [userObj, setUserObj] = useState({});
  const [userItem, setUserItem] = useState({});
  const [userAccept, setUserAccept] = useState({});
  const [notUserId, setNotUserId] = useState('');
  const [traderObj, setTraderObj] = useState({});
  const [traderItem, setTraderItem] = useState({});
  const [traderAccept, setTraderAccept] = useState({});
  const [swapHaggle, setSwap] = useState({});
  const [inventory, setInventory] = useState('');
  const user = supabase.auth.user();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSwap = async () => {
      try {
        const { data } = await supabase
          .from('swaps')
          .select()
          .single()
          .eq('id', swap.id);

        setSwap(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSwap();
  }, [swap.id]);

  useEffect(() => {
    const userInfo = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('users')
          .select(
            `
          avatarUrl,
          username,
          id
          `
          )
          .eq('id', user.id);
        setUserObj(...data);
        if (swapHaggle.outbound_id === user.id) {
          setUserItem({ ...swapHaggle.outbound_offer });
          setNotUserId(swapHaggle.inbound_id);
          setTraderItem({ ...swapHaggle.inbound_offer });
          setUserAccept({
            userAccept: swapHaggle.outbound_accept,
            inOrOut: 'outbound',
          });
          setTraderAccept({
            userAccept: swapHaggle.inbound_accept,
            inOrOut: 'inbound',
          });
        }
        if (swapHaggle.inbound_id === user.id) {
          setUserItem({ ...swapHaggle.inbound_offer });
          setNotUserId(swapHaggle.outbound_id);
          setTraderItem({ ...swapHaggle.outbound_offer });
          setUserAccept({
            userAccept: swapHaggle.inbound_accept,
            inOrOut: 'inbound',
          });
          setTraderAccept({
            userAccept: swapHaggle.outbound_accept,
            inOrOut: 'outbound',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    userInfo();
  }, [
    swapHaggle.outbound_offer,
    swapHaggle.inbound_offer,
    swapHaggle.outbound_id,
    swapHaggle.inbound_id,
    user.id,
    swapHaggle.inbound_accept,
    swapHaggle.outbound_accept,
  ]);

  useEffect(() => {
    const trader = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('users')
          .select(
            `
          avatarUrl,
          username,
          id

          `
          )
          .eq('id', notUserId);

        setTraderObj(...data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    trader();
  }, [notUserId]);

  // final settlement between users are set when both agree
  // the database is updated from 'active' to 'processing?'
  //this is completed when both users hand off the trade
  // another method here may be to set it as complete and render a time
  //limit for both the exchange items or repurcussion on there reputation status may happen
  useEffect(() => {
    const setAgreement = async () => {
      try {
        if (swapHaggle.inbound_accept && swapHaggle.outbound_accept) {
          await supabase
            .from('swaps')
            .update({
              status: 'agreed',
              
            })
            .eq('id', swapHaggle.id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    setAgreement();
  }, [swapHaggle.id, swapHaggle.outbound_accept, swapHaggle.inbound_accept]);

  const handleAcceptance = async (check) => {
    try {
      
  
      if (check.inOrOut === 'inbound') {
        await supabase
          .from('swaps')
          .update({
            inbound_accept: true,
            inbound_offer: userItem,
          })
          .eq('id', swapHaggle.id);
      }

      if (check.inOrOut === 'outbound') {
        await supabase
          .from('swaps')
          .update({
            outbound_accept: true,
            outbound_offer: userItem
          })
          .eq('id', swapHaggle.id);
      }
    } catch (error) {
      console.error(error);
    }
  };
  supabase
    .from('swaps')
    .on('UPDATE', (button) => {
      setSwap(button.new);
    })
    .subscribe();

  const handleConfimation = async (check) => {
    try {
      if (check === 'inbound') {
        await supabase
          .from('swaps')
          .update({
            inbound_confirm: true,
          })
          .eq('id', swapHaggle.id);
      } else {
        await supabase
          .from('swaps')
          .update({
            outbound_confirm: true,
          })
          .eq('id', swapHaggle.id);
      }
    } catch (error) {
      console.error(error);
    }
    navigate('/messages', { state: { swap } });
  };

 

  //testing
  // console.log('userObj', userObj);
  // console.log('useraccept', userAccept.inOrOut);
  // console.log('userItem', userItem);
  //console.log('TraderObj', traderObj);
  //console.log('Traderaccept', traderAccept);
  // console.log('TraderItem', traderItem);
  // console.log('status, ', swap.status);
  //console.log('haggle', swapHaggle)

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="grid grid-cols-3 px-10 justify-items-center gap-10 mt-20">
      <div className="realtive justify-center">
        <div>
          <input type="checkbox" id="my-modal-5" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <div>
                <h3 className="font-bold text-lg">
                  Congratulations! Both swappers have come to an agreement!
                </h3>
                <p className="py-4">
                  By clicking confirm you both have met each other at the agreed
                  upon location and have swapped the agreed upon items. In order
                  to get credit for a completed transaction, and for the item to
                  change hands, bot swappers must confirm that the swap has
                  taken place, and rate their swapmates.
                </p>
                <div className="modal-action">
                  <label
                    htmlFor="my-modal-5"
                    className="btn"
                    onClick={() => handleConfimation(userAccept.inOrOut)}
                  >
                    Confirm!
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 grid justify-center">
          <img
            src={traderObj.avatarUrl}
            alt="..."
            className="shadow h-48 w-48 rounded-full"
          />
        </div>
        <div className="drawer h-96">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content ">
            <div className="flex grid grid-cols-2">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button "
                onClick={() => setInventory(traderObj.inOrOut)}
              >
                See Other Items
              </label>
              <button
                className="btn btn-xs sm:btn-sm md:btn-md w-full text-black"
                disabled="disabled"
              >
                Accept Terms
              </button>
            </div>
            <div className="bg-indigo-300 w-full grid grid-rows-1 justify-center">
              <Card
                id={traderItem.id}
                imageUrl={traderItem.image_url}
                className="pb=12"
              />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto  bg-base-100 text-base-content mr-12">
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory('')}
              >
                Close
              </label>
              <HaggleInventory user={notUserId} setItem={setUserItem} />
            </ul>
          </div>
        </div>
      </div>

      <Chat
        MyUserName={userObj.username}
        TheirUserName={traderObj.username}
        MyAvatarUrl={userObj.avatarUrl}
        TheirAvatarUrl={traderObj.avatarUrl}
        receiver={traderObj.id}
        sender={userObj.id}
        swap={swap}
      />

      <div className="realtive justify-center">
        <div className="px-4 grid justify-center">
          <img
            src={userObj.avatarUrl}
            alt="..."
            className="shadow h-48 w-48 rounded-full border-none"
          />
        </div>
        <div className="drawer drawer-end h-96">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="flex grid grid-cols-2">
              {userAccept.userAccept ? (
                traderAccept.userAccept ? (
                  <label
                    htmlFor="my-modal-5"
                    className="btn modal-button w-full"
                  >
                    Mark Complete
                  </label>
                ) : (
                  <button className="btn loading">Waiting...</button>
                )
              ) : (
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md w-full"
                  onClick={() => handleAcceptance(userAccept)}
                >
                  Accept Terms
                </button>
              )}
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory(userObj.inOrOut)}
              >
                My Items
              </label>
            </div>
            <div className="bg-gray-100 w-full grid grid-rows-1 justify-center">
              <Card id={userItem.id} imageUrl={userItem.image_url} />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

            <ul className="menu p-4 overflow-y-auto w-full md:w-auto bg-base-100 text-base-content ml-12">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-primary drawer-button"
                onClick={() => setInventory('')}
              >
                Close
              </label>
              <HaggleInventory user={userObj.id} setItem={setTraderItem} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaggleView;

