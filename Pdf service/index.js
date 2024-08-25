const PDFDocument = require('pdfkit');

const generateEventReport = (event) => {
    const doc = new PDFDocument();
    doc.fontSize(25).text(`Event Report: ${event.name}`, { align: 'center' });

    doc.fontSize(20).text(`Sessions:`);
    event.sessions.forEach((session, index) => {
        doc.fontSize(15).text(`${index + 1}. ${session.title} by ${session.speaker}`);
    });

    doc.moveDown();
    doc.fontSize(20).text(`Participants:`);
    event.participants.forEach((participant, index) => {
        doc.fontSize(15).text(`${index + 1}. ${participant.name} (${participant.email})`);
    });

    doc.end();
    return doc;
};

module.exports = { generateEventReport };
