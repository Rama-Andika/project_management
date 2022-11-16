import Cookies from "js-cookie";
import { createRef, useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Api from "../../../api";
import LayoutAdmin from "../../../layouts/Admin";
import ReactQuill from "react-quill";
//mapbox gl
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const PlacesCreate = () => {
  //title page
  document.title = "Add New Place - Administrator Rama Wisata";

  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [officeHours, setOfficeHours] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [images, setImages] = useState([]);

  const [validation, setValidation] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const fetchCategories = async () => {
    await Api.get("/api/web/categories").then((response) => {
      setCategories(response.data.data);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const imageData = e.target.files;
    Array.from(imageData).forEach((image) => {
      if (!image.type.match("image.*")) {
        setImages([]);

        toast.error("Format file not supported", {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }

      setImages([...e.target.files]);
    });
  };

  const storePlace = async (e) => {
    e.preventDefault();
    

    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category_id", categoryId);
    formData.append("description", description);
    formData.append("phone", phone);
    formData.append("website", website);
    formData.append("office_hours", officeHours);
    formData.append("address", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    Array.from(images).forEach((image) => {
      formData.append("image[]", image);
    });

    await Api.post("/api/admin/places", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success("Data place saved succesfully", {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setLoading(false);
        navigate("/admin/places");
      })
      .catch((error) => {
        setValidation(error.response.data);
        setLoading(false);
      });
  };

  //=========================================================
  //MAPBOX
  //=========================================================

  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [115.188919, -8.409518],
      zoom: 9,
    });

    //init marker
    const marker = new mapboxgl.Marker({
      draggable: true,
      color: "rgb(47 128 237)",
    })
      //set longtitude and latitude
      .setLngLat([115.188919, -8.409518])
      //add marker to map
      .addTo(map);

    marker.on("dragend", function (e) {
      //assign longitude and latitude to state
      setLongitude(e.target._lngLat.lng);
      setLatitude(e.target._lngLat.lat);
    });

    //init geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: mapboxgl, // Set the mapbox-gl instance
      marker: {
        draggable: true,
      },
      placeholder: "Search for places",
    });

    //add geocoder to map
    map.addControl(geocoder);

    //geocoder result
    geocoder.on("result", function (e) {
      //remove marker
      marker.remove();
      //set longitude and latitude
      marker
        .setLngLat(e.result.center)

        //add to map
        .addTo(map);

      //event marker on dragend
      marker.on("dragend", function (e) {
        //assign longitude and latitude to state
        setLongitude(e.target._lngLat.lng);
        setLatitude(e.target._lngLat.lat);
      });
    });

    //init map

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LayoutAdmin>
      <Row className="mt-4">
        <Col>
          <Card className="border-0 rounded shadow-sm">
            <Card.Header>
              <span className="fs-bold">
                <i className="fa fa-map-marked"></i> PLACES CREATE
              </span>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={storePlace}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Images <i>(can select many image)</i>
                  </Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} multiple />
                </Form.Group>
                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    {validation.title && <Alert variant="danger">{validation.title[0]}</Alert>}
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">-- Select Category --</option>
                        {categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    {validation.category_id && <Alert variant="danger">{validation.category_id[0]}</Alert>}
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <ReactQuill theme="snow" rows="5" value={description} onChange={(content) => setDescription(content)} />
                </Form.Group>
                {validation.description && <Alert variant="danger">{validation.description[0]}</Alert>}
                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </Form.Group>
                    {validation.phone && <Alert variant="danger">{validation.phone[0]}</Alert>}
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Website</Form.Label>
                      <Form.Control type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </Form.Group>
                    {validation.website && <Alert variant="danger">{validation.website[0]}</Alert>}
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Office Hours</Form.Label>
                  <Form.Control type="text" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} />
                </Form.Group>
                {validation.office_hours && <Alert variant="danger">{validation.office_hours[0]}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
                </Form.Group>
                {validation.address && <Alert variant="danger">{validation.address[0]}</Alert>}
                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} readOnly disabled />
                    </Form.Group>
                    {validation.latitude && <Alert variant="danger">{validation.latitude[0]}</Alert>}
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} readOnly disabled />
                    </Form.Group>
                    {validation.longitude && <Alert variant="danger">{validation.longitude[0]}</Alert>}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <div ref={mapContainer} className="map-container" />
                  </Col>
                </Row>
                <div>
                  {loading ? (
                    <Button className="w-100" disabled style={{ background: "#00b4d8" }}>
                      <Spinner as="span" animation="border" role="status" size="sm" />
                      <span className="visually-hidden">Loading...</span>
                    </Button>
                  ) : (
                    <Button type="submit" className="w-100" style={{ background: "#00b4d8" }}>
                      Save
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutAdmin>
  );
};

export default PlacesCreate;
