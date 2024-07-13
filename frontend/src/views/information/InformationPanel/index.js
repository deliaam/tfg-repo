import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

// project imports
import { Box } from '@mui/system';
import ClassService from 'services/class.service';
import { connect } from 'react-redux';
import { Grid, Card, CardContent } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import MainCard from 'ui-components/MainCard';
import BreadcrumbsComponent from 'ui-components/BreadcrumbsComponent';
import { useDispatch } from 'react-redux';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const InformationPanel = (props) => {
    const [classList, setClassList] = useState(undefined);
    const [classObj, setClass] = useState(undefined);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <Grid container direction="column" spacing={3}>
            <Grid item xs>
                <Grid container direction="row" spacing={3}>
                    <Grid item xs>
                        <Card>
                            <CardContent>
                                <Typography variant="h2" gutterBottom>
                                    Clases
                                </Typography>
                                <Typography variant="body1">
                                    En la pestaña "Mis clases" se podrán observar todas las clases a las que se puede acceder. Para unirse a
                                    una clase deberá introducir un código único que será proporcionado por el profesor. Dentro de cada clase
                                    podrá ver las tareas, preguntas y el ránking correspondiente a dicha clase, así como el resto de
                                    recursos relacionados con los anteriores.
                                </Typography>
                                <Typography variant="h2" gutterBottom>
                                    Tareas
                                </Typography>
                                <Typography varian="body1">
                                    Por defecto, se mostrará un listado de tareas ordenadas por fecha límite de entrega, de mayor a menor.
                                    El orden se puede cambiar, de igual manera que se puede filtrar por temas o el estado de la tarea. El
                                    estado de la tarea puede ser:
                                </Typography>
                                <ul>
                                    <li>
                                        <strong>Cerrado</strong>: La fecha límite de entrega es anterior a la fecha de hoy. No se puede
                                        entregar más soluciones.
                                    </li>
                                    <li>
                                        <strong>Pendiente</strong>: La fecha límite de entrega es posterior a la fecha de hoy y el usuario
                                        no ha entregado aún una solución. En este caso el usuario tiene dos opciones:
                                        <ul>
                                            <li>Renunciar a la tarea para poder ver las soluciones del resto de los alumnos.</li>
                                            <li>Entregar una solución.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Entregado</strong>: La fecha límite de entrega es posterior a la fecha de hoy y el usuario
                                        ya ha entregado una solución, por lo que no puede entregar más.
                                    </li>
                                </ul>
                                <Typography variant="body1">
                                    Cabe destacar que al visualizar una tarea se podrá acceder a la pestaña "Preguntas" para ver únicamente
                                    las preguntas relacionadas con dicha tarea.
                                </Typography>
                                <Typography variant="h4" gutterBottom>
                                    Soluciones y correcciones
                                </Typography>
                                <Typography variant="body1">
                                    Además, en la información de la tarea también se mostrará el número total de soluciones que han sido
                                    entregadas para dicha tarea, y cuántas de ellas ha corregido el usuario.
                                </Typography>
                                <Typography variant="body1">
                                    El usuario podrá entregar únicamente una solución por tarea, y una corrección por solución. La
                                    calificación escogida en la corrección cambiará la calificación total de la solución, por lo que el
                                    usuario que ha entregado una solución deberá revisar todas las correcciones y hacer una petición de
                                    revisión al profesor por cada corrección que considere incorrecta, para evitar un mal cálculo de la
                                    calificación de su solución.
                                </Typography>
                                <Typography variant="h2" gutterBottom>
                                    Preguntas
                                </Typography>
                                <Typography varian="body1">
                                    Por defecto, se mostrará un listado de preguntas ordenadas por fecha de publicación, de mayor a menor.
                                    El orden se puede cambiar, de igual manera que se puede filtrar por temas o el estado de la pregunta. El
                                    estado de la pregunta puede ser:
                                </Typography>
                                <ul>
                                    <li>
                                        <strong>Resuelta</strong>: Un usuario ha entregado una respuesta correcta, no se permiten más
                                        respuestas.
                                    </li>
                                    <li>
                                        <strong>Pendiente</strong>: Ningún usuario ha entregado una respuesta correcta.
                                    </li>
                                </ul>
                                <Typography variant="h4" gutterBottom>
                                    Respuestas
                                </Typography>
                                <Typography variant="body1">
                                    Además, en la información de la pregunta también se mostrará el número total de respuestas que han sido
                                    entregadas para dicha pregunta.
                                </Typography>
                                <Typography variant="body1">
                                    El usuario podrá entregar únicamente una respuesta por pregunta. El usuario que ha creado la pregunta
                                    podrá marcar la respuesta que considere oportuna como correcta.
                                </Typography>
                                <Typography variant="h2" gutterBottom>
                                    Puntuación
                                </Typography>
                                <Typography paragraph>
                                    Los alumnos pueden recibir puntos a través de entregar soluciones, corregir soluciones de otros alumnos
                                    o responder correctamente a preguntas. Cada una de estas opciones otorgará distintos puntos y se
                                    calculará de distintas maneras. Además, para evitar la utilización indebida de este sistema para obtener
                                    puntos, se restará puntuación a soluciones y correcciones erróneas. Las puntuaciones que se muestran en
                                    las tablas de las siguientes secciones son estimaciones iniciales, que serán ajustadas de la manera
                                    correspondiente tras un análisis de los datos recogidos en el futuro, cuando la aplicación se comience a
                                    utilizar.
                                </Typography>

                                <Typography variant="h4" gutterBottom>
                                    Cálculo de la clasificación de una solución
                                </Typography>
                                <Typography paragraph>
                                    En primer lugar, es necesario clarificar cómo se calculará la clasificación de una solución. Esto se
                                    hará en el momento de cierre de la tarea, es decir, cuando su fecha de entrega límite haya expirado. Se
                                    realizará en base a las clasificaciones asignadas por las correcciones que no han sido eliminadas al ser
                                    revisadas por el profesor:
                                </Typography>
                                <ul>
                                    <li>
                                        <strong>Bien</strong>: Todas las clasificaciones de las correcciones son Bien.
                                    </li>
                                    <li>
                                        <strong>Regular</strong>: Existe alguna corrección que la clasifique como Regular.
                                    </li>
                                    <li>
                                        <strong>Mal</strong>: Existe alguna corrección que la clasifique como Mal.
                                    </li>
                                </ul>

                                <Typography variant="h4" gutterBottom>
                                    Respuestas correctas
                                </Typography>
                                <Typography paragraph>
                                    En cuanto el alumno creador de la pregunta marque la respuesta que considere correcta como tal,
                                    automáticamente se le asignará al alumno que ha respondido 50 puntos más.
                                </Typography>

                                <Typography variant="h4" gutterBottom>
                                    Soluciones
                                </Typography>
                                <Typography paragraph>
                                    La puntuación que recibe el alumno que ha entregado la solución se calculará también en el momento de
                                    cierre de la tarea, en base a la clasificación de la solución:
                                </Typography>
                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Solución</TableCell>
                                                <TableCell align="center">Puntuación</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center">Bien</TableCell>
                                                <TableCell align="center">+100</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Regular</TableCell>
                                                <TableCell align="center">+50</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Mal</TableCell>
                                                <TableCell align="center">-25</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Typography variant="h4" gutterBottom>
                                    Correcciones
                                </Typography>
                                <Typography paragraph>
                                    La puntuación que recibe el alumno que ha corregido la solución se calculará también en el momento de
                                    cierre de la tarea, en base a la clasificación de la solución y en función de la clasificación de la
                                    corrección.
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Solución</TableCell>
                                                <TableCell align="center">Corrección</TableCell>
                                                <TableCell align="center">Puntuación</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center">Bien</TableCell>
                                                <TableCell align="center">Bien</TableCell>
                                                <TableCell align="center">+25</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Bien</TableCell>
                                                <TableCell align="center">Regular</TableCell>
                                                <TableCell align="center">+0</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Bien</TableCell>
                                                <TableCell align="center">Mal</TableCell>
                                                <TableCell align="center">+0</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Regular</TableCell>
                                                <TableCell align="center">Bien</TableCell>
                                                <TableCell align="center">-15</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Regular</TableCell>
                                                <TableCell align="center">Regular</TableCell>
                                                <TableCell align="center">+25</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Regular</TableCell>
                                                <TableCell align="center">Mal</TableCell>
                                                <TableCell align="center">+0</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Mal</TableCell>
                                                <TableCell align="center">Bien</TableCell>
                                                <TableCell align="center">-30</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Mal</TableCell>
                                                <TableCell align="center">Regular</TableCell>
                                                <TableCell align="center">-15</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="center">Mal</TableCell>
                                                <TableCell align="center">Mal</TableCell>
                                                <TableCell align="center">+25</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(InformationPanel);
