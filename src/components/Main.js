import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import LoadingPage from './LoadingPage';
import Card from './Card';
import { Link } from 'react-router-dom';
import StepBar from './StepBar';
import { useNavigate } from 'react-router-dom';
import '../main.css';
const Main = () => {
  const [getImages, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const user = supabase.auth.user();

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('items')
          .select(
            `name, description, ownerId, id, category, listed, image_url, created_at`
          )
          .eq('listed', true)
          .neq(
            'ownerId',
            user ? user.id : '11111111-1111-1111-1111-111111111111'
          );

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setImages(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  useEffect(() => {
    const filter = async () => {
      try {
        const set = Array.from(
          new Set(
            getImages.map((type) => {
              return type.category;
            })
          )
        );
        setList(set);
      } catch (error) {
        console.error(error);
      }
    };
    filter();
  }, [getImages]);

  useEffect(() => {
    const catergories = () => {
      try {
        const check = [];
        const image = [];
        list.map((cat) => {
          getImages.forEach((item) => {
            if (cat === item.category) {
              if (!check.includes(cat)) {
                check.push(cat);
                image.push([cat, item.image_url]);
              }
            }
          });
        });
        setCategoryList(image);
      } catch (error) {
        console.error(error);
      }
    };
    catergories();
  }, [list, getImages]);

  const recentlyadded = getImages.slice(getImages.length - 14);
 
  return loading ? (
    <LoadingPage />
  ) : (
    <div>
      <div className="mt-3 relative flex h-1/3 lg:h-2/3 bg-white border overflow-hidden shadow-lg shadow-indigo-500/50 ">
        <img
          src="https://images.unsplash.com/photo-1543372742-e08542e25f8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWVtcGhpcyUyMHRlbm5lc3NlZXxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt=""
          className="h-96 w-full object-cover backdrop-brightness-90 rounded-md "
        />
        <div className="absolute inset-y-14 rounded-lg p-4 text-indigo-50 text-4xl md:text-5xl lg:text-7xl pl-20 pt-10">
          <p>The Largest</p>
          <p>Community of</p>
          <p>Swapping Enthusiasts</p>
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold mb-4 mt-6">Categories</p>

        <div className="flex h-96 flex-no-wrap overflow-x-scroll scrollbar-hide  scrolling-touch items-start mb-8">
          {categoryList.map((image, i) => {
            return (
              <div
                key={i}
                className="flex-none mr-8 relative border rounded-lg shadow-md shadow-indigo-400/50"
              >
                <button
                  type="button"
                  onClick={() => navigate('/items', { state: { image } })}
                >
                  <img
                    src={image[1]}
                    alt=""
                    className="h-80 w-96 rounded-t-lg  hover:opacity-60 transition-opacity duration-1000 ease-out"
                  />
                </button>
                <div className="flex bg-white justify-center text-gray-700 text-xl font-semibold pt-1">
                  {image[0]}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-2xl font-semibold mb-4 mt-6">Recently Added</div>
        <section className="gallery bg-indigo-50">
          <figure className="gallery__item gallery__item--1">
            <Link to={`/items/${recentlyadded[0].id}`}>
              <img
                src={recentlyadded[0].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--2">
            <Link to={`/items/${recentlyadded[1].id}`}>
              <img
                src={recentlyadded[1].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--3">
            <Link to={`/items/${recentlyadded[2].id}`}>
              <img
                src={recentlyadded[2].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--4">
            <Link to={`/items/${recentlyadded[3].id}`}>
              <img
                src={recentlyadded[3].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--5">
            <Link to={`/items/${recentlyadded[4].id}`}>
              <img
                src={recentlyadded[4].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--6">
            <Link to={`/items/${recentlyadded[5].id}`}>
              <img
                src={recentlyadded[5].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--7">
            <Link to={`/items/${recentlyadded[6].id}`}>
              <img
                src={recentlyadded[6].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--8">
            <Link to={`/items/${recentlyadded[7].id}`}>
              <img
                src={recentlyadded[7].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--9">
            <Link to={`/items/${recentlyadded[8].id}`}>
              <img
                src={recentlyadded[8].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--10">
            <Link to={`/items/${recentlyadded[9].id}`}>
              <img
                src={recentlyadded[9].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--11">
            <Link to={`/items/${recentlyadded[10].id}`}>
              <img
                src={recentlyadded[10].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--12">
            <Link to={`/items/${recentlyadded[11].id}`}>
              <img
                src={recentlyadded[11].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--13">
            <Link to={`/items/${recentlyadded[12].id}`}>
              <img
                src={recentlyadded[12].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
          <figure className="gallery__item gallery__item--14">
            <Link to={`/items/${recentlyadded[13].id}`}>
              <img
                src={recentlyadded[13].image_url}
                alt=""
                className="gallery__img"
              />
            </Link>
          </figure>
        </section>
      </div>

      <StepBar />
      <div className="text-2xl font-semibold mb-4 mt-6">Top Accounts</div>

      <div className="col-span-2">
        <div className="hero w-full">
          <div className="h-56"></div>
          <div class="hero-overlay bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Main;
