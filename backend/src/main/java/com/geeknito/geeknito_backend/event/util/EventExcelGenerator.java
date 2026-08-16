package com.geeknito.geeknito_backend.event.util;

import com.geeknito.geeknito_backend.entity.learning.EventEntity;
import com.geeknito.geeknito_backend.event.dto.ExportRowDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class EventExcelGenerator {

    public static ByteArrayInputStream generateEventRegistrationsExport(EventEntity event, List<ExportRowDTO> rows) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Event Registrations");

            // Enable grid lines
            sheet.setDisplayGridlines(true);

            // Brand Purple Color (#6C1D5F)
            byte[] purpleRgb = new byte[]{(byte) 108, (byte) 29, (byte) 95};
            XSSFColor brandPurple = new XSSFColor(purpleRgb, null);

            // Light gray alternate zebra row color (#F3F4F6)
            byte[] zebraRgb = new byte[]{(byte) 243, (byte) 244, (byte) 246};
            XSSFColor zebraGray = new XSSFColor(zebraRgb, null);

            // Create styles
            // 1. Main Title style
            XSSFFont titleFont = workbook.createFont();
            titleFont.setFontName("Calibri");
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setBold(true);
            titleFont.setColor(brandPurple);

            XSSFCellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);

            // 2. Metadata Label style (Bold)
            XSSFFont metaLabelFont = workbook.createFont();
            metaLabelFont.setFontName("Calibri");
            metaLabelFont.setFontHeightInPoints((short) 10);
            metaLabelFont.setBold(true);

            XSSFCellStyle metaLabelStyle = workbook.createCellStyle();
            metaLabelStyle.setFont(metaLabelFont);

            // 3. Metadata Value style
            XSSFFont metaValueFont = workbook.createFont();
            metaValueFont.setFontName("Calibri");
            metaValueFont.setFontHeightInPoints((short) 10);

            XSSFCellStyle metaValueStyle = workbook.createCellStyle();
            metaValueStyle.setFont(metaValueFont);

            // 4. Table Header style
            XSSFFont headerFont = workbook.createFont();
            headerFont.setFontName("Calibri");
            headerFont.setFontHeightInPoints((short) 11);
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            XSSFCellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(brandPurple);
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.LEFT);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            applyBorders(headerStyle);

            // 5. Data cell style standard
            XSSFFont dataFont = workbook.createFont();
            dataFont.setFontName("Calibri");
            dataFont.setFontHeightInPoints((short) 10);

            XSSFCellStyle standardStyle = workbook.createCellStyle();
            standardStyle.setFont(dataFont);
            standardStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            applyBorders(standardStyle);

            // 6. Zebra row cell style
            XSSFCellStyle zebraStyle = workbook.createCellStyle();
            zebraStyle.setFont(dataFont);
            zebraStyle.setFillForegroundColor(zebraGray);
            zebraStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            zebraStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            applyBorders(zebraStyle);

            // Create title
            XSSFRow row0 = sheet.createRow(1);
            row0.setHeightInPoints(24);
            XSSFCell titleCell = row0.createCell(1);
            titleCell.setCellValue("GEEKNITO LMS - EVENT REGISTRATION REPORT");
            titleCell.setCellStyle(titleStyle);

            // Event Details Block
            int currentInfoRow = 3;

            // Row 3: Event Title
            XSSFRow rowAsg = sheet.createRow(currentInfoRow++);
            XSSFCell cellLabel1 = rowAsg.createCell(1);
            cellLabel1.setCellValue("Event Title:");
            cellLabel1.setCellStyle(metaLabelStyle);
            XSSFCell cellVal1 = rowAsg.createCell(2);
            cellVal1.setCellValue(event.getTitle());
            cellVal1.setCellStyle(metaValueStyle);

            // Row 4: Location Mode
            XSSFRow rowMode = sheet.createRow(currentInfoRow++);
            XSSFCell cellLabel2 = rowMode.createCell(1);
            cellLabel2.setCellValue("Location Mode / Venue:");
            cellLabel2.setCellStyle(metaLabelStyle);
            XSSFCell cellVal2 = rowMode.createCell(2);
            cellVal2.setCellValue(event.getLocationMode() + (event.getVenue() != null ? " (" + event.getVenue() + ")" : ""));
            cellVal2.setCellStyle(metaValueStyle);

            // Row 5: Organizer
            XSSFRow rowOrg = sheet.createRow(currentInfoRow++);
            XSSFCell cellLabel3 = rowOrg.createCell(1);
            cellLabel3.setCellValue("Organizer:");
            cellLabel3.setCellStyle(metaLabelStyle);
            XSSFCell cellVal3 = rowOrg.createCell(2);
            cellVal3.setCellValue(event.getOrganizerName() + " (" + event.getOrganizerEmail() + ")");
            cellVal3.setCellStyle(metaValueStyle);

            // Row 6: Schedule
            XSSFRow rowSched = sheet.createRow(currentInfoRow++);
            XSSFCell cellLabel4 = rowSched.createCell(1);
            cellLabel4.setCellValue("Event Date:");
            cellLabel4.setCellStyle(metaLabelStyle);
            XSSFCell cellVal4 = rowSched.createCell(2);
            cellVal4.setCellValue(event.getStartDate() + " to " + event.getEndDate());
            cellVal4.setCellStyle(metaValueStyle);

            // Row 7: Capacity & Registrations
            XSSFRow rowCap = sheet.createRow(currentInfoRow++);
            XSSFCell cellLabelCap = rowCap.createCell(1);
            cellLabelCap.setCellValue("Capacity / Registered:");
            cellLabelCap.setCellStyle(metaLabelStyle);
            XSSFCell cellValCap = rowCap.createCell(2);
            cellValCap.setCellValue(event.getCapacity() + " / " + event.getRegisteredCount());
            cellValCap.setCellStyle(metaValueStyle);

            // Row 8: Generated Timestamp
            XSSFRow rowTime = sheet.createRow(currentInfoRow++);
            XSSFCell cellLabel5 = rowTime.createCell(1);
            cellLabel5.setCellValue("Report Generated On:");
            cellLabel5.setCellStyle(metaLabelStyle);
            XSSFCell cellVal5 = rowTime.createCell(2);
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            cellVal5.setCellValue(now.format(formatter));
            cellVal5.setCellStyle(metaValueStyle);

            // Spacing
            currentInfoRow++;
            int headerRowNum = currentInfoRow;

            // Table Headers
            String[] headers = {
                    "Student Name",
                    "Email",
                    "Registered At",
                    "Attendance Status",
                    "Certificate Issued",
                    "Remarks"
            };

            XSSFRow headerRow = sheet.createRow(headerRowNum);
            headerRow.setHeightInPoints(26);

            for (int i = 0; i < headers.length; i++) {
                XSSFCell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Fill Table Data Rows
            int dataRowNum = headerRowNum + 1;
            DateTimeFormatter dtFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            for (int r = 0; r < rows.size(); r++) {
                ExportRowDTO item = rows.get(r);
                XSSFRow row = sheet.createRow(dataRowNum++);
                row.setHeightInPoints(20);

                XSSFCellStyle currentStyle = (r % 2 == 1) ? zebraStyle : standardStyle;

                createCellWithStyle(row, 0, item.getStudentName(), currentStyle);
                createCellWithStyle(row, 1, item.getStudentEmail(), currentStyle);
                createCellWithStyle(row, 2, item.getRegisteredAt() != null ? item.getRegisteredAt().format(dtFormatter) : "", currentStyle);
                createCellWithStyle(row, 3, item.getAttendanceStatus(), currentStyle);
                createCellWithStyle(row, 4, item.isCertificateIssued() ? "Yes" : "No", currentStyle);
                createCellWithStyle(row, 5, item.getRemarks(), currentStyle);
            }

            // Freeze first row
            sheet.createFreezePane(0, headerRowNum + 1);

            // Enable Auto-Filter
            if (rows.size() > 0) {
                sheet.setAutoFilter(new CellRangeAddress(headerRowNum, dataRowNum - 1, 0, headers.length - 1));
            }

            // Adjust Column Widths
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                int currentWidth = sheet.getColumnWidth(i);
                sheet.setColumnWidth(i, Math.max(currentWidth + 1200, 3500));
            }

            // Write to stream
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    private static void createCellWithStyle(XSSFRow row, int colIndex, String val, XSSFCellStyle style) {
        XSSFCell cell = row.createCell(colIndex);
        cell.setCellValue(val != null ? val : "");
        cell.setCellStyle(style);
    }

    private static void applyBorders(XSSFCellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setBottomBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setLeftBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setRightBorderColor(IndexedColors.GREY_25_PERCENT.getIndex());
    }
}
