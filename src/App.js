import React, { useState, useEffect } from "react";
import useInfiniteScroll from "@closeio/use-infinite-scroll";
import Loader from "./components/loader/index";
import "./App.css";

const WrapperMain = (props) => {
  return <div className="w-full h-full">{props.children}</div>;
};

const Header = () => {
  return (
    <header className="border-b-2 border-gray-200">
      <nav className="flex justify-center w-full bg-headerGrey text-black text-xl p-4">
        <a href="/">
          <span className="font-medium text-xl">Users</span>
        </a>
      </nav>
    </header>
  );
};

const BodyContainer = (props) => {
  return <div className="container mx-auto">{props.children}</div>;
};

const ListContainer = (props) => {
  return (
    <div className="w-full relative grid gap-6 bg-white dark:bg-gray-800 px-6 py-6 sm:gap-8 divide-y divide-gray-100">
      {props.children}
    </div>
  );
};

const ListItem = (props) => {
  return (
    <a href="/" className="-m-3 p-3 flex items-center hover:bg-gray-50">
      <img
        alt="profile"
        src={props.imgurl}
        className="flex-shrink-2 h-16 w-16 mr-2 rounded-full"
      />
      <div className="ml-4">
        <p className="text-base font-medium text-gray-900 dark:text-white">
          {props.name}
        </p>
      </div>
    </a>
  );
};

const LoaderContainer = (props) => {
  return (
    <div className="flex h-screen">
      <div className="m-auto">{props.children}</div>
    </div>
  );
};

function App() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, loaderRef, scrollerRef] = useInfiniteScroll({ hasMore });

  useEffect(() => {
    (async () => {
      const realPage = page + 1;
      const resp = await fetch(`https://reqres.in/api/users?page=${realPage}`);
      const data = await resp.json();
      setHasMore(realPage < data.total_pages);
      setTimeout(() => {
        setItems((prev) => [...prev, ...data.data]);
      }, 2000);
    })();
  }, [page]);

  return (
    <React.Fragment>
      <WrapperMain>
        <Header></Header>
        <BodyContainer>
          {!items.length && (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          )}
          <ListContainer>
            <div ref={scrollerRef}>
              {items.map((item) => {
                const name = `${item.first_name} ${item.last_name}`;
                return (
                  <ListItem
                    key={item.id}
                    imgurl={item.avatar}
                    name={name}
                  ></ListItem>
                );
              })}
              <div ref={loaderRef} className="my-8">
                {" "}
                {hasMore
                  ? "Loading more users..."
                  : "You are at end of the list 😊"}{" "}
              </div>
            </div>
          </ListContainer>
        </BodyContainer>
      </WrapperMain>
    </React.Fragment>
  );
}

export default App;
