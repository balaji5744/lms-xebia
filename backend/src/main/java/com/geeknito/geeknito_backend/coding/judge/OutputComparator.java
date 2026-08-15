package com.geeknito.geeknito_backend.coding.judge;

import org.springframework.stereotype.Component;

@Component
public class OutputComparator {

    public boolean compare(String actual, String expected) {
        if (actual == null && expected == null) {
            return true;
        }
        if (actual == null || expected == null) {
            return false;
        }

        String normActual = normalize(actual);
        String normExpected = normalize(expected);

        return normActual.equals(normExpected);
    }

    private String normalize(String text) {
        // Replace CRLF with LF
        String lfText = text.replace("\r\n", "\n").replace("\r", "\n");
        // Split by lines
        String[] lines = lfText.split("\n", -1);
        
        // Trim trailing spaces for each line
        StringBuilder sb = new StringBuilder();
        int lastNonEmptyLine = -1;
        for (int i = 0; i < lines.length; i++) {
            lines[i] = trimTrailing(lines[i]);
            if (!lines[i].isEmpty()) {
                lastNonEmptyLine = i;
            }
        }

        // Reconstruct string omitting trailing empty lines
        for (int i = 0; i <= lastNonEmptyLine; i++) {
            sb.append(lines[i]);
            if (i < lastNonEmptyLine) {
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    private String trimTrailing(String s) {
        int len = s.length();
        while (len > 0 && s.charAt(len - 1) <= ' ') {
            len--;
        }
        return s.substring(0, len);
    }
}
