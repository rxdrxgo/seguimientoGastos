// REFERENCIAS
// MODAL: https://react-bootstrap.netlify.app/docs/components/modal/
// PAGINACION: https://dev.to/canhamzacode/how-to-implement-pagination-with-reactjs-2b04
// COMPONENTES: https://react-bootstrap.netlify.app/docs/components/dropdowns
// USESTATE: https://www.w3schools.com/react/react_usestate.asp
// https://midu.dev/react-hooks-use-state-anadiendo-estado-a-nuestro-componente-funcional/
// https://react.dev/reference/react/useState
// https://legacy.reactjs.org/docs/hooks-state.html


import React, { Fragment, useState, useEffect } from 'react';
import uuid4 from 'uuid4';
import { Row, Col, Card, Button, InputGroup, FormControl, Modal, Pagination, Dropdown} from 'react-bootstrap';

const Gasto = () => {
  const [gastos, setGastos] = useState([]);
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editId, setEditId] = useState(null);
  const [editMonto, setEditMonto] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mostrarModalValidacion, setMostrarModalValidacion] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsXPagina] = useState(12);
  const [ordenGastos, setOrdenGastos] = useState('desc');

  useEffect(() => {
    const sGastos = JSON.parse(localStorage.getItem('gastos'));
    if (sGastos) {
      setGastos(sGastos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos));
  }, [gastos]);

  const agregarGasto = () => {
    if (!monto.trim() || !categoria.trim() || !descripcion.trim()) {
      setMostrarModalValidacion(true)
      return;
    }

    const nuevoGasto = {
      id: uuid4(),
      monto: parseFloat(monto),
      categoria: categoria.trim(),
      descripcion: descripcion.trim(),
    };

    setGastos(prevGastos => [...prevGastos, nuevoGasto]);
    setMonto('');
    setCategoria('');
    setDescripcion('');
  };

  const eliminarGasto = (id) => {
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id);
    setGastos(gastosActualizados);
  };

  const calcularTotalGastos = () => {
    return gastos.reduce((total, gasto) => total + gasto.monto, 0);
  };

  const ResumenGastos = () => {
    const total = calcularTotalGastos();
    const color = total >= 0 ? '#d4edda' : '#f8d7da';
	

    return (
      <div className="alert" style={{color:'black', backgroundColor: color}}>
        <h4 className="text-center">
          {total >= 0 ? 'Total de Gastos/Ingresos' : 'Total de Gastos/Ingresos'}
        </h4>
        <p className="text-center">
          <strong>Total:</strong> ${total}
        </p>
      </div>
    );
  };

  const handleShowModal = (gasto) => {
    setEditId(gasto.id);
    setEditMonto(gasto.monto);
    setEditCategoria(gasto.categoria);
    setEditDescripcion(gasto.descripcion);
    setShowModal(true);
  };

  const guardarCambios = () => {
    setGastos(gastos.map(gasto =>
      gasto.id === editId
        ? { ...gasto, monto: editMonto, categoria: editCategoria, descripcion: editDescripcion }
        : gasto
    ));
    setShowModal(false);
  };

  const indexOfLastExpense = paginaActual * itemsXPagina;
  const indexOfFirstExpense = indexOfLastExpense - itemsXPagina;

  const numeroPaginas = [];
  for (let i = 1; i <= Math.ceil(gastos.length / itemsXPagina); i++) {
    numeroPaginas.push(i);
  }

  const cambiarPagina = (pageNumber) => {
    setPaginaActual(pageNumber);
  }

  const cancelarCambios = () => {
    setShowModal(false);
  };

  const gastosOrdenados = gastos
  .sort((a, b) => ordenGastos === 'asc' ? a.monto - b.monto : b.monto - a.monto);

  const gastosF = gastosOrdenados.slice(indexOfFirstExpense, indexOfLastExpense);


  return (
    <Fragment>
		<h1 className="display-5 text-center my-4"><strong>Seguimiento de Gastos</strong></h1>


		<Row className='my-5'>
			<Col xl={2} md={3} sm={5}>
					<InputGroup className="mb-3">
					<InputGroup.Text id="monto">Monto:</InputGroup.Text>
					<FormControl
						type="number"
						placeholder="-50000"
						value={monto}
						onChange={(e) => setMonto(e.target.value)}
					/>
					</InputGroup>
			</Col>


			<Col xl={4} md={4} sm={7}>
				<InputGroup className="mb-3">
				<InputGroup.Text id="categoria">Categoría:</InputGroup.Text>
				<FormControl
					placeholder="Comida"
					value={categoria}
					onChange={(e) => setCategoria(e.target.value)}
				/>
				</InputGroup>
			</Col>

			<Col xl={4} md={5} sm={7}>
				<InputGroup className="mb-3">
				<InputGroup.Text id="descripcion">Descripción:</InputGroup.Text>
				<FormControl
					placeholder="Compras del supermercado"
					value={descripcion}
					onChange={(e) => setDescripcion(e.target.value)}
				/>
				</InputGroup>
			</Col>
				
			<Col xl={2} md={12} sm={4} className='text-center'>
				<Button className='mx-1 btn' onClick={agregarGasto}>Agregar</Button>
			</Col>
		</Row>
		<Row>
			<Col xs={12} md={12} sm={12} className="mb-3 text-center">
			<Dropdown >
				<Dropdown.Toggle variant="secondary" id="sort-dropdown">Ordenar por</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item onClick={() => setOrdenGastos('asc')}>Menor a Mayor</Dropdown.Item>
              		<Dropdown.Item onClick={() => setOrdenGastos('desc')}>Mayor a Menor</Dropdown.Item>
            	</Dropdown.Menu>
          	</Dropdown>
        	</Col>
		</Row>

		{gastosF.length > 0 && (
			<div className="row">
				{gastosF.map(gasto => (
					<Col xs={12} sm={6} md={4} lg={3} xl={2} key={gasto.id} className="mb-4">
						<Card>
							<div className="card-body">
								<h5 className="card-title">{gasto.categoria}</h5>
								<p className="card-text">
								<strong>Monto:</strong> ${gasto.monto}<br />
								<strong>Descripción:</strong> {gasto.descripcion}
								</p>
								<Button
								variant="primary"
								className="me-2"
								onClick={() => handleShowModal(gasto)}>Editar</Button>
								<Button
								variant="danger"
								className='ms-1'
								onClick={() => eliminarGasto(gasto.id)}>Eliminar</Button>
							</div>
						</Card>
					</Col>
				))}
			</div>
      )}
	  

        <ResumenGastos />

		{gastos.length > itemsXPagina && (
        <Pagination className="justify-content-center my-4">
          {numeroPaginas.map(number => (
            <Pagination.Item
              key={number}
              active={number === paginaActual}
              onClick={() => cambiarPagina(number)}
            >
              {number}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

        <Modal show={showModal} onHide={cancelarCambios}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Gasto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="monto">Monto:</InputGroup.Text>
              <FormControl
                type="number"
                value={editMonto}
                onChange={(e) => setEditMonto(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="categoria">Categoría:</InputGroup.Text>
              <FormControl
                value={editCategoria}
                onChange={(e) => setEditCategoria(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="descripcion">Descripción:</InputGroup.Text>
              <FormControl
                value={editDescripcion}
                onChange={(e) => setEditDescripcion(e.target.value)}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelarCambios}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={guardarCambios}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={mostrarModalValidacion} onHide={() => setMostrarModalValidacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{color: 'black'}}>Campos Obligatorios</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color: 'black'}}>
          <h6>los campos Monto, Descripcion y Categoria son obligatorios</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalValidacion(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Gasto;

