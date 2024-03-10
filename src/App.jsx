import "./index.css";
import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const storedPosts = JSON.parse(localStorage.getItem("posts"));
    if (storedPosts) {
      setPosts(storedPosts);
      setLoading(false);
    } else {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((data) => {
          const first15Posts = data.slice(0, 15);
          setPosts(first15Posts);
          setLoading(false);
        });
    }
  }, []);

  const handleDelete = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lastUserId =
      posts.length > 0 ? Math.max(...posts.map((post) => post.userId)) : 0;
    const lastId =
      posts.length > 0 ? Math.max(...posts.map((post) => post.id)) : 0;
    const updatedPost = { ...newPost, userId: lastUserId + 1, id: lastId + 1 };
    setPosts([updatedPost, ...posts]);
    setNewPost({ title: "", body: "", userId: lastUserId + 1 });

    const currentPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const updatedPosts = [updatedPost, ...currentPosts];
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <button type="submit">Post Ekle</button>
        </form>
        {posts.map((post) => (
          <div key={post.id} className="card">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="author">Kullanıcı: {post.userId}</p>
            <button
              className="delete-button"
              onClick={() => handleDelete(post.id)}
            >
              Sil
            </button>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
