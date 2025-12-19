import nodemailer from "nodemailer";
import Leave from "../model/leave.model.js";

export const SendEmailController = async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);

        if (!data.leaves || !Array.isArray(data.leaves) || data.leaves.length === 0) {
            return res.status(400).json({ message: "No leaves provided" });
        }

        // Convert "YYYY-MM-DD" to IST date string
        const convertToIST = (dateStr) => {
            const d = new Date(`${dateStr}T00:00:00Z`);
            if (isNaN(d)) throw new Error(`Invalid date value: ${dateStr}`);
            d.setMinutes(d.getMinutes() + 330); // IST offset
            return d.toISOString().split("T")[0];
        };

        // Process leaves
        const processedLeaves = data.leaves.map((leave) => ({
            date: convertToIST(leave.date),
            leave_type: leave.leave_type,
            session: leave.session || null
        }));

        // Prepare leave document according to your schema
        const leaveDoc = {
            email: data.email,
            leave_mode: data.leave_mode,
            leaves: processedLeaves,
            reason: data.reason
        };

        // Save to DB
        const result = await Leave.create(leaveDoc);

        // Prepare email content
        const leaveDescriptions = processedLeaves
            .map((l) => {
                let type = "";
                let time = "";

                switch (l.leave_type) {
                    case "half":
                        type = "Half Day";
                        time = `Session: ${l.session || "-"}`;
                        break;
                    case "short":
                        type = "Short Leave";
                        time = `Session: ${l.session || "-"}`;
                        break;
                    case "full_day":
                        type = "Full Day";
                        break;
                    case "restricted":
                        type = "Restricted";
                        break;
                    default:
                        type = l.leave_type;
                }

                return `Leave Type: ${type}\nDate: ${l.date}\n${time ? time : ""}`;
            })
            .join("\n\n");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sahilsharma83999@gmail.com",
                pass: "fgfj upky enzo oehf",
            },
        });

        const mailOptions = {
            from: `"Leave Application System" <no-reply@netmente.com>`,
            replyTo: data.email,
            to: "ragbrok194@gmail.com",
            subject: `Leave Request from ${data.email}`,
            text: `
Leave Request Details:

Employee Email: ${data.email}

${leaveDescriptions}

Reason: ${data.reason}
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "Leave submitted successfully",
            result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit leave", error: err.message });
    }
}