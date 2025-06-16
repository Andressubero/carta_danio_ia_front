import React from "react";
import { Card } from "react-bootstrap";

const VehicleCard = ({ vehicle }) => {
  return (
    <Card className="mb-3" style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{vehicle.brand} {vehicle.model}</Card.Title>
        <Card.Text><strong>Año:</strong> {vehicle.year}</Card.Text>
        <Card.Text><strong>Tipo:</strong> {vehicle.type}</Card.Text>
        <Card.Text><strong>Placa:</strong> {vehicle.plate}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export { VehicleCard };