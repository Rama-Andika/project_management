const Search = ({ onSubmit, value, onChange,name }) => {
  return (
    <form onSubmit={onSubmit} className="form-group">
      <div className="input-group mb-3">
        <input type="text" className="form-control" value={value} onChange={onChange} placeholder={`search by ${name}`} />
        <button type="submit" className="btn btn-md btn-success">
          <i className="fa fa-search"></i> SEARCH
        </button>
      </div>
    </form>
  );
};

export default Search;
