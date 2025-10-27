const Profile = () => {
  return (
    <div
      className="absolute top-6 left-[50px] flex items-center justify-center gap-2 p-3 pr-5"
      id="balanceContainer"
    >
      <div className="z-10">
        <img
          src="https://cdn.artstation.com/p/thumbnails/000/277/745/thumb.jpg"
          alt="avatar"
          className="aspect-square size-[70px] rounded-sm"
        />
      </div>
      <div className="z-10">
        <p className="text-3xl font-mont">Mutawirr</p>
        <p className="text-xl font-[500] font-mont">level 1</p>
      </div>
    </div>
  );
};

export default Profile;
