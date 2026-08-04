/**
 * GOOGLE APPS SCRIPT - BACKEND SERVERLESS PARA COFEPRIS (MAMBAS TATTOO)
 * 
 * Instrucciones de Despliegue:
 * 1. Abre Google Drive y crea una nueva "Hoja de cálculo de Google" (Google Sheets).
 * 2. En el menú superior, ve a "Extensiones" -> "Apps Script".
 * 3. Borra el código existente y pega este archivo completo.
 * 4. Guarda el proyecto (ej. "Mambas COFEPRIS Backend").
 * 5. Haz clic en "Implementar" (Deploy) -> "Nueva implementación" (New deployment).
 * 6. Selecciona tipo: "Aplicación web" (Web App).
 * 7. Configura:
 *    - Ejecutar como: "Tú" (tu cuenta de Google).
 *    - Quién tiene acceso: "Cualquiera" (Anyone) - Obligatorio para peticiones públicas.
 * 8. Haz clic en "Implementar" y autoriza los permisos requeridos.
 * 9. Copia la "URL de la aplicación web" (termina en `/exec`). Esta es la URL que debes pegar 
 *    en la constante SCRIPT_URL de tus archivos HTML estáticos.
 */

function doPost(e) {
  // Manejo de cabeceras simplificado (CORS)
  var responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    var data = {};
    
    // Intentar leer el cuerpo JSON
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Si no es JSON puro, parsear como parámetros url-encoded
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    // Validar tipo de formulario para definir la pestaña destino
    var formType = data.form_type || data.formType || "cuestionario";
    var sheetName = "Cuestionarios";
    if (formType === "bitacora") {
      sheetName = "Bitacora";
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Agregar fecha/hora de registro (Timestamp) local
    if (!data.fecha_registro) {
      var localDate = new Date();
      // Formato legible: DD/MM/AAAA HH:MM:SS
      data.fecha_registro = Utilities.formatDate(localDate, "GMT-6", "dd/MM/yyyy HH:mm:ss");
    }

    // Obtener los encabezados actuales de la hoja
    var lastColumn = sheet.getLastColumn();
    var headersInSheet = [];
    if (lastColumn > 0) {
      headersInSheet = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    }

    // Las llaves que queremos guardar (excluyendo metadatos de control)
    var keys = Object.keys(data).filter(function(k) {
      return k !== "form_type" && k !== "formType";
    });

    // Asegurar que fecha_registro sea la primera columna
    var dateIdx = keys.indexOf("fecha_registro");
    if (dateIdx > -1) {
      keys.splice(dateIdx, 1);
    }
    keys.unshift("fecha_registro");

    // Verificar si hay columnas nuevas en el payload y agregarlas a los encabezados
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (headersInSheet.indexOf(key) === -1) {
        headersInSheet.push(key);
      }
    }

    // Actualizar fila de encabezados en la hoja
    sheet.getRange(1, 1, 1, headersInSheet.length).setValues([headersInSheet]);

    // Crear arreglo de valores correspondientes a los encabezados
    var newRow = [];
    for (var j = 0; j < headersInSheet.length; j++) {
      var header = headersInSheet[j];
      var value = data[header] !== undefined && data[header] !== null ? data[header] : "";
      
      // Sanitizar posibles celdas
      newRow.push(value);
    }

    // Insertar la fila al final
    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registro guardado correctamente en la pestaña " + sheetName,
      sheet: sheetName
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheetParam = e.parameter.sheet || "cuestionarios";
    var sheetName = "Cuestionarios";
    if (sheetParam.toLowerCase() === "bitacora") {
      sheetName = "Bitacora";
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
    }

    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    
    // Si la hoja no tiene registros
    if (lastRow < 2 || lastColumn < 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
    }

    // Obtener todos los valores (incluyendo cabeceras)
    var values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
    var headers = values[0];
    var list = [];

    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var record = { id: i }; // ID interno incremental
      for (var j = 0; j < headers.length; j++) {
        var val = row[j];
        // Formatear fechas a string local
        if (val instanceof Date) {
          val = Utilities.formatDate(val, "GMT-6", "dd/MM/yyyy HH:mm:ss");
        }
        record[headers[j]] = val;
      }
      list.push(record);
    }

    return ContentService.createTextOutput(JSON.stringify(list))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
