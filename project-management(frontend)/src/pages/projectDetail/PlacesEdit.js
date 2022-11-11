import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const PlacesEdit = () => {
  document.title = "Edit Place - Administrator Rama Wisata";

  //state form

  const [title, setTitle] = useState("");

  const [categoryID, setCategoryID] = useState("");

  const [description, setDescription] = useState("");

  const [phone, setPhone] = useState("");

  const [website, setWebsite] = useState("");

  const [office_hours, setOfficeHours] = useState("");

  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState("");

  const [longitude, setLongitude] = useState("");

  //state image array / multiple

  const [images, setImages] = useState([]);

  //state categories

  const [categories, setCategories] = useState([]);

  //state validation

  const [validation, setValidation] = useState({});

  const token = Cookies.get("token");

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    await Api.get("/api/web/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setCategories(response.data.data);
    });
  };

  const getPlaceById = async () => {
    setLoading(true);
    await Api.get(`/api/admin/places/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data response to state

      setTitle(response.data.data.title);

      setCategoryID(response.data.data.category_id);

      setDescription(response.data.data.description);

      setPhone(response.data.data.phone);

      setWebsite(response.data.data.website);

      setOfficeHours(response.data.data.office_hours);

      setAddress(response.data.data.address);

      setLatitude(response.data.data.latitude);

      setLongitude(response.data.data.longitude);

      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
    getPlaceById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } else {
        setImages([...e.target.files]);
      }
    });
  };

  const editPlaces = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    //append data to "formData"

    formData.append("title", title);

    formData.append("category_id", categoryID);

    formData.append("description", description);

    formData.append("phone", phone);

    formData.append("website", website);

    formData.append("office_hours", office_hours);

    formData.append("address", address);

    formData.append("latitude", latitude);

    formData.append("longitude", longitude);

    formData.append("_method", "PATCH");

    Array.from(images).forEach((image) => {
      formData.append("image[]", image);
    });

    await Api.post(`/api/admin/places/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        toast.success("Data Updated Successfully!", {
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
    //init map

    const map = new mapboxgl.Map({
      container: mapContainer.current,

      style: "mapbox://styles/mapbox/streets-v11",

      center: [longitude, latitude],

      zoom: 9,
    });

    //init marker

    const marker = new mapboxgl.Marker({
      draggable: true,

      color: "rgb(47 128 237)",
    })

      .setLngLat([longitude, latitude])

      .addTo(map);

    marker.on("dragend", function (e) {
      setLongitude(e.target._lngLat.lng);
      setLatitude(e.target._lngLat.lat);
    });

    //init geocoder

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: {
        draggable: true,
      },
    });

    map.addControl(geocoder);

    //geocoder result

    geocoder.on("result", function (e) {
      marker.remove();

      marker.setLngLat(e.result.center).addTo(map);

      marker.on("dragend", function (e) {
        setLongitude(e.target._lngLat.lng);
        setLatitude(e.target._lngLat.lat);
      });
    });
   
  }, [longitude, latitude]);

  return (
    <LayoutAdmin>
      <Row className="mt-4">
        <Col>
          <Card className="border-0 rounded shadow-sm">
            <Card.Header>
              <span className="fw-bold">
                <i className="fa fa-map-marked"></i> PLACES EDIT
              </span>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={editPlaces}>
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
                      <Form.Select value={categoryID} onChange={(e) => setCategoryID(e.target.value)}>
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
                  <Form.Control type="text" value={office_hours} onChange={(e) => setOfficeHours(e.target.value)} />
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
                    <Button className="w-100" disabled variant="warning">
                      <Spinner as="span" animation="border" role="status" size="sm" />
                      <span className="visually-hidden">Loading...</span>
                    </Button>
                  ) : (
                    <Button type="submit" className="w-100" variant="warning">
                      Edit
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

export default PlacesEdit;
