---
title: Política de Privacidad
permalink: /politica-de-privacidad/
layout: page
---

**Última actualización: 17 de septiembre de 2026**

---

## 1. Responsable del tratamiento

**Aplicación:** Testealo
**Titular:** Jose Francisco Jimenez Alburquerque
**Correo de contacto:** [testealojusticia@gmail.com](mailto:testealojusticia@gmail.com)

---

## 2. Datos que se tratan

La aplicación **Testealo** trata únicamente los datos necesarios para prestar el servicio.

### 2.1 Datos de cuenta

El acceso a Testealo se realiza mediante proveedores de identidad externos
(Google, Apple y Facebook), gestionados a través de Auth0. Testealo **no crea ni
almacena contraseñas**.

De la cuenta con la que inicias sesión se tratan:

* Identificador único que asigna el proveedor a tu cuenta.
* Dirección de correo electrónico.
* Imagen de perfil (si el proveedor la facilita).

---

### 2.2 Datos obtenidos de tu cuenta de Google

Si eliges **«Continuar con Google»**, Testealo solicita únicamente los permisos
(*scopes*) estándar de OpenID Connect: `openid`, `profile`, `email` y
`offline_access`. En concreto:

| Permiso | A qué da acceso | Para qué lo usamos |
|---|---|---|
| `openid` | Identificador único de tu cuenta de Google | Reconocer tu cuenta entre sesiones y vincular tu progreso |
| `email` | Tu dirección de correo electrónico | Identificarte de forma única y comunicarnos contigo sobre el servicio |
| `profile` | Datos básicos del perfil público: nombre e imagen | Mostrar tu imagen de perfil dentro de la app |
| `offline_access` | Un token de actualización | Mantener la sesión iniciada sin pedirte credenciales cada vez |

De esos datos, Testealo **conserva en su base de datos** el identificador de la
cuenta, el correo electrónico y la URL de la imagen de perfil. El nombre no se
almacena.

**Testealo NO solicita ni accede** a Gmail, Google Drive, Google Calendar,
Contactos, Fotos, tu ubicación ni a ningún otro dato de tu cuenta de Google. No
se utiliza ningún permiso clasificado por Google como sensible o restringido.

Los datos obtenidos de Google se usan **exclusivamente** para prestar las
funciones descritas arriba. **No se venden, no se ceden con fines publicitarios
ni se emplean para entrenar modelos de inteligencia artificial.** Testealo no
incluye ningún SDK de publicidad.

Puedes revocar el acceso en cualquier momento desde la página de
[permisos de tu cuenta de Google](https://myaccount.google.com/permissions), sin
perjuicio de tu derecho a solicitar la eliminación de la cuenta (apartado 9).

---

### 2.3 Datos de uso de la aplicación

* Oposiciones o competiciones seleccionadas.
* Resultados de tests (aciertos, fallos, no contestadas y fecha/hora).
* Estadísticas y rankings mostrados de forma seudonimizada dentro de la app.

---

### 2.4 Datos de suscripción y pagos

* Estado de la suscripción, tipo de plan y periodos.
* Identificadores técnicos necesarios para la verificación de pagos a través de Google Play o Apple App Store.

**No accedemos a datos completos de tarjetas bancarias.**

---

### 2.5 Funciones basadas en inteligencia artificial

Al utilizar funciones de IA:

* El texto introducido por el usuario se procesa únicamente para generar la respuesta solicitada.
* Los datos **no se utilizan para entrenar modelos de inteligencia artificial**.
* El contenido no se conserva de forma permanente.

Se recomienda no introducir datos personales sensibles en estas funciones.

---

### 2.6 Datos técnicos

* Registros técnicos mínimos necesarios para el funcionamiento, seguridad y detección de errores de la aplicación.

---

## 3. Finalidad del tratamiento

Los datos se utilizan para:

* Prestar el servicio principal de la app.
* Gestionar cuentas, progreso y resultados.
* Verificar suscripciones y pagos.
* Garantizar la seguridad y el correcto funcionamiento del servicio.
* Cumplir obligaciones legales.

---

## 4. Base legal

* Ejecución de un contrato (prestación del servicio).
* Consentimiento del usuario cuando sea requerido.
* Interés legítimo en la seguridad y mejora del servicio.
* Cumplimiento de obligaciones legales.

---

## 5. Terceros y proveedores

Para el funcionamiento de la aplicación pueden intervenir proveedores externos, entre ellos:

* **Auth0 (Okta)** — gestión del inicio de sesión con Google, Apple y Facebook.
* **Google LLC** — inicio de sesión con Google, Google Play (gestión de pagos) y
  Firebase Analytics (estadísticas de uso agregadas de la app).
* **Apple Inc.** — inicio de sesión con Apple y App Store (gestión de pagos).
* **DigitalOcean y Hetzner** — alojamiento de la base de datos y del servidor.
* **Proveedores de modelos de inteligencia artificial** — únicamente para
  generar las respuestas de las funciones de IA descritas en el apartado 2.5.

Estos proveedores solo tratan los datos necesarios para prestar el servicio conforme a la normativa aplicable.

---

## 6. Transferencias internacionales

Algunos proveedores pueden estar ubicados fuera del Espacio Económico Europeo.
En estos casos, las transferencias se realizan conforme a los mecanismos legales previstos por la normativa vigente.

---

## 7. Seguridad y protección de los datos

Testealo aplica las siguientes medidas técnicas y organizativas para proteger la
información, incluidos los datos obtenidos de tu cuenta de Google:

**Cifrado en tránsito.** Toda la comunicación entre la aplicación y nuestros
servidores viaja cifrada mediante HTTPS/TLS. La conexión entre el servidor y la
base de datos también está cifrada con TLS.

**Cifrado en reposo.** La base de datos se aloja en un servicio gestionado que
aplica cifrado en reposo tanto a los datos como a sus copias de seguridad.

**Sin contraseñas propias.** La autenticación se delega en proveedores de
identidad externos a través de Auth0. Testealo nunca recibe ni almacena tu
contraseña de Google.

**Protección de los tokens de sesión.** En tu dispositivo, los tokens de acceso
y actualización se guardan en el almacén seguro del sistema operativo (Llavero
en iOS, almacén de credenciales cifrado en Android), no en ficheros de texto
plano.

**Verificación de cada petición.** Las llamadas a nuestra API exigen un token
firmado, cuya firma (RS256) y destinatario se validan en el servidor contra las
claves públicas del proveedor de identidad en cada solicitud.

**Minimización de datos.** Solo se almacenan los datos necesarios para prestar
el servicio: identificador de cuenta, correo electrónico y URL de la imagen de
perfil. No se recogen ni almacenan datos de tarjetas bancarias, que gestionan
íntegramente Google Play y Apple App Store.

**Control de acceso.** El acceso administrativo a los datos está restringido a
un número limitado de personas autorizadas y previamente identificadas, y las
credenciales de los servicios se gestionan fuera del código fuente.

**Seudonimización.** Las clasificaciones y rankings que se muestran en la
aplicación no exponen la identidad de otros usuarios.

Ninguna medida de seguridad es infalible. Si detectaras un problema de seguridad
en Testealo, te agradecemos que nos escribas a
[testealojusticia@gmail.com](mailto:testealojusticia@gmail.com).

---

## 8. Conservación de los datos

* Los datos se conservan mientras la cuenta del usuario esté activa.
* Los datos necesarios para obligaciones legales se conservarán durante los plazos exigidos por la normativa.
* Los registros técnicos se conservan el tiempo mínimo necesario.

El usuario puede solicitar la eliminación de su cuenta en cualquier momento. Para ver los pasos, consulta: **[Eliminar cuenta]({{ '/eliminar-cuenta/' | relative_url }})**.

---

## 9. Derechos del usuario

El usuario puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a:

📧 **[testealojusticia@gmail.com](mailto:testealojusticia@gmail.com)**

También puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).

---

## 10. Menores de edad

La aplicación **no está dirigida a menores de 14 años** y no recopila de forma intencionada datos personales de menores de esa edad.

---

## 11. Cambios en la política

Esta política puede actualizarse para reflejar cambios legales o técnicos.
La versión vigente estará siempre disponible en esta misma URL.
