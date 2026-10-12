# Canada Study Navigator

สร้าง Web Application สำหรับบริษัทเอเจนซี่ศึกษาต่อประเทศแคนาดา โดยระบบมีหน้าที่ช่วยนักเรียนค้นหาและสมัครหลักสูตร และช่วยลดขั้นตอนการทำงานแบบ Manual ของ Student, Agent และ College

เว็บไซต์ต้องเป็นระบบที่ใช้งานได้จริง มีฐานข้อมูล และมีการทำงานอัตโนมัติในส่วนที่ระบบสามารถตรวจสอบหรือจัดการได้

เทคโนโลยีที่ใช้

* Next.js

* JavaScript

* HTML

* CSS

* MySQL

ใช้ Next.js สำหรับ Frontend และ Backend โดยใช้ API สำหรับติดต่อกับ MySQL

ระบบต้องสามารถเปิดและพัฒนาผ่าน VS Code ได้

1. ประเภทผู้ใช้งาน

มีผู้ใช้งาน 3 ประเภท

* Student

* Agent

* College

แต่ละประเภทมีสิทธิ์และ Dashboard แตกต่างกัน

2. Student

Student ต้องสมัครสมาชิกและ Login ก่อนจึงจะสามารถสมัครหลักสูตรได้

ข้อมูลสมัครสมาชิก

* ชื่อ

* นามสกุล

* Email

* Password

Email ต้องไม่ซ้ำ

หลังจาก Login ระบบต้องถามว่า Student มีผลสอบภาษาหรือไม่

ถ้าไม่มีผลสอบภาษา

Student กรอกความสนใจ เช่น

* เมืองที่ต้องการเรียน

* ประเภทหลักสูตร

* สาขาที่สนใจ

* ระยะเวลาเรียน

* งบประมาณ

* ระดับการศึกษาปัจจุบัน

* เป้าหมายในการเรียน

ระบบแสดงหลักสูตรที่ตรงกับความสนใจ และแสดงระดับภาษาที่แต่ละหลักสูตรต้องการ

Student ยังไม่สามารถสมัครหลักสูตรได้จนกว่าจะมีผลสอบภาษา

ถ้ามีผลสอบภาษา

Student กรอก

* ประเภทการสอบ

* คะแนน

* ระดับภาษา

* วันที่สอบ

* วันหมดอายุ ถ้ามี

* อัปโหลดผลสอบ

3. ระบบตรวจสอบระดับภาษาอัตโนมัติ

ระบบต้องตรวจสอบระดับภาษาของ Student กับระดับภาษาที่ Course กำหนดโดยอัตโนมัติ

ตัวอย่าง

Student มีระดับ B1

Course ต้องการ B1

ระบบแสดง

สามารถสมัครได้

ถ้า Student มีระดับ A2 แต่ Course ต้องการ B1

ระบบแสดง

ยังไม่สามารถสมัครได้

และแสดงระดับภาษาที่ Course ต้องการ

Student ไม่สามารถสมัคร Course ที่ระดับภาษาไม่ถึงได้

Agent ไม่ต้องตรวจระดับภาษาเอง

4. ระบบแนะนำหลักสูตร

ระบบนำข้อมูลความสนใจของ Student มาเปรียบเทียบกับข้อมูล Course

เช่น

* เมือง

* ประเภทหลักสูตร

* สาขา

* ระยะเวลา

* งบประมาณ

* ระดับภาษา

ระบบแสดง Course ที่ตรงกับข้อมูลของ Student

Course แต่ละรายการต้องแสดง

* ชื่อ Course

* College

* เมือง

* ระยะเวลา

* ค่าใช้จ่าย

* ระดับภาษาที่ต้องการ

* รายละเอียด Course

* สถานะว่าสมัครได้หรือไม่

5. ระบบตรวจสอบเอกสาร

เมื่อ Student สมัคร Course ระบบต้องแสดงรายการเอกสารที่จำเป็น

ตัวอย่าง

* Passport

* Transcript

* Certificate

* Language Test

* รูปถ่าย

* เอกสารเพิ่มเติม

ระบบต้องตรวจสอบโดยอัตโนมัติว่าเอกสารที่จำเป็นถูกอัปโหลดครบหรือยัง

ถ้าเอกสารไม่ครบ

ระบบต้องแสดงว่าเอกสารใดขาด

ตัวอย่าง

เอกสารยังไม่ครบ

ขาด Transcript

Student ต้องอัปโหลดให้ครบก่อนจึงจะสามารถส่ง Application ได้

จุดประสงค์คือช่วยลดงานของ Agent ที่ต้องเปิดเอกสารทีละ Application เพื่อตรวจว่ามีไฟล์ครบหรือไม่

หมายเหตุ: ระบบตรวจสอบความครบของเอกสาร แต่ Agent ยังเป็นผู้ตรวจสอบว่าเอกสารถูกต้องและใช้ได้จริง

6. การสมัคร Course

เมื่อ Student เลือก Course ที่สามารถสมัครได้

Student อัปโหลดเอกสาร

ระบบตรวจสอบว่าเอกสารครบหรือไม่

ถ้าครบ Student สามารถ Submit Application

Application ถูกส่งไปยัง Agent

ระบบบันทึกวันที่และเวลาที่ส่ง

7. Student Dashboard

Dashboard ต้องแสดง

* ข้อมูลส่วนตัว

* Course ที่แนะนำ

* Course ที่สามารถสมัครได้

* Application

* สถานะ Application

* เอกสาร

* Offer

* Invoice

* Payment

* Notification

Student ต้องสามารถติดตาม Application ได้โดยไม่ต้องติดต่อ Agent เพื่อถามสถานะ

8. Agent Dashboard

Agent Dashboard ต้องแสดง

* Application ใหม่

* Application ที่กำลังตรวจสอบ

* Application ที่ต้องแก้ไข

* Application ที่ส่งให้ College แล้ว

* Offer

* Invoice

* Payment

* Notification

ระบบต้องช่วย Agent แสดงเฉพาะงานที่ Agent ต้องดำเนินการ

ตัวอย่าง

ถ้ามี Application ใหม่

ระบบแสดง Application นั้นในรายการ "รอตรวจสอบ"

Agent ไม่ต้องค้นหา Application เอง

9. ระบบช่วยตรวจสอบ Application

Agent เปิด Application แล้วระบบแสดงข้อมูลทั้งหมดในหน้าเดียว

* ข้อมูล Student

* Course

* ผลสอบภาษา

* เอกสาร

* สถานะเอกสาร

* ข้อมูลการสมัคร

ระบบต้องแสดงผลการตรวจสอบเบื้องต้น เช่น

* ระดับภาษาผ่าน

* เอกสารครบ

* ข้อมูลที่จำเป็นครบ

Agent ตรวจสอบความถูกต้องของข้อมูลและเอกสาร

ถ้าถูกต้อง Agent กดส่ง Application ให้ College

ถ้าไม่ถูกต้อง Agent สามารถส่งกลับให้ Student แก้ไข

ระบบต้องบันทึกสถานะและแจ้ง Student อัตโนมัติ

10. การส่ง Application ให้ College

เมื่อ Agent กดส่ง Application

ระบบต้อง

* เปลี่ยนสถานะ Application

* บันทึกวันที่และเวลา

* ส่ง Application ให้ College

* แจ้งเตือน College

Agent ไม่ต้องส่งเอกสารผ่าน Email หรือช่องทางอื่นนอกระบบ

11. College Dashboard

College เห็น Application ที่ถูกส่งมาจาก Agent

สามารถดู

* ข้อมูล Student

* Course

* เอกสาร

* ผลสอบภาษา

* ข้อมูล Application

College ตรวจสอบ Application

หากต้องการข้อมูลเพิ่มเติม สามารถส่งกลับให้ Agent หรือ Student แก้ไขได้

12. Offer และ Invoice

เมื่อ College อนุมัติ Application

College สามารถอัปโหลด

* Offer Letter

* Invoice

ระบบบันทึกเอกสารไว้กับ Application นั้น

เมื่อ College อัปโหลดเอกสาร

ระบบแจ้ง Agent อัตโนมัติ

Agent สามารถดาวน์โหลด Offer และ Invoice และส่งให้ Student ผ่านระบบ

ระบบแจ้ง Student อัตโนมัติ

Student สามารถดูและดาวน์โหลดเอกสารได้

13. ระบบ Payment

Student เปิด Invoice และเห็นจำนวนเงินที่ต้องชำระ

Student ชำระเงินและอัปโหลดหลักฐานการชำระเงิน

Student กรอก

* จำนวนเงิน

* วันที่ชำระ

* หลักฐานการชำระเงิน

ระบบตรวจสอบเบื้องต้นโดยอัตโนมัติ

เช่น

จำนวนเงินที่ Student กรอกต้องตรงกับจำนวนเงินใน Invoice

ถ้ายอดไม่ตรง

ระบบแจ้งเตือน Student ทันที

ถ้ายอดตรง

ระบบส่ง Payment ไปให้ Agent ตรวจสอบ

Agent ตรวจสอบหลักฐานการชำระเงินจริง

ถ้าหลักฐานไม่ถูกต้อง

Agent ส่งกลับให้ Student แก้ไข

ถ้าถูกต้อง

Agent ส่งข้อมูลการชำระเงินให้ College

14. ระบบแจ้งเตือน

ระบบต้องมี Notification ภายในเว็บไซต์

ไม่ต้องให้ผู้ใช้คอยตรวจสอบเองว่ามีงานใหม่หรือไม่

Student ได้รับแจ้งเตือนเมื่อ

* Application ถูกส่งแล้ว

* ต้องแก้ไข Application

* Application ผ่านการตรวจสอบ

* มี Offer

* มี Invoice

* ต้องชำระเงิน

* Payment มีปัญหา

* Payment ผ่านการตรวจสอบ

Agent ได้รับแจ้งเตือนเมื่อ

* มี Application ใหม่

* Student แก้ไข Application

* College อนุมัติ Application

* College อัปโหลด Offer

* College อัปโหลด Invoice

* Student ส่ง Payment

College ได้รับแจ้งเตือนเมื่อ

* มี Application ใหม่

* Agent ส่ง Application มา

* Agent ส่งข้อมูล Payment มา

15. ระบบเปลี่ยนสถานะ

ระบบต้องเปลี่ยนสถานะตามการทำงานของผู้ใช้

สถานะหลัก

* รอตรวจสอบ

* ส่งกลับให้แก้ไข

* ส่งให้ College แล้ว

* ออก Offer แล้ว

* ส่งเอกสารให้นักเรียนแล้ว

* รอชำระเงิน

* รอตรวจสอบการชำระเงิน

* ชำระเงินแล้ว

* เตรียมรับนักเรียน

* เสร็จสิ้น

เมื่อผู้ใช้ดำเนินการในระบบ ระบบต้องเปลี่ยนสถานะให้อัตโนมัติ

ไม่ต้องให้ผู้ใช้กรอกสถานะเอง

16. ระบบลดงาน Manual

ระบบต้องออกแบบให้ลดงานที่ต้องทำด้วยตนเอง

ระบบควรช่วยทำงานอัตโนมัติ เช่น

* ตรวจสอบระดับภาษา

* ตรวจสอบเอกสารว่าครบหรือไม่

* ตรวจสอบข้อมูลเบื้องต้น

* ตรวจสอบยอดเงินกับ Invoice

* แนะนำ Course

* เปลี่ยนสถานะ

* แจ้งเตือนผู้เกี่ยวข้อง

* ส่งข้อมูลต่อระหว่าง Student, Agent และ College

* แสดงรายการงานที่ต้องดำเนินการให้แต่ละ Role

แต่การตัดสินใจที่ต้องใช้การตรวจสอบของคนยังเป็นหน้าที่ของ Agent หรือ College

ตัวอย่าง

ระบบสามารถตรวจว่าเอกสารครบ

แต่ Agent เป็นคนตรวจว่าเอกสารนั้นถูกต้อง

ระบบสามารถตรวจว่ายอดเงินตรงกับ Invoice

แต่ Agent และ College เป็นคนตรวจสอบหลักฐานการชำระเงินจริง

17. สถานะ Application

Student ต้องเห็น Timeline ของ Application

ตัวอย่าง

รอตรวจสอบ

→ ส่งให้ College แล้ว

→ ออก Offer แล้ว

→ ส่งเอกสารให้นักเรียนแล้ว

→ รอชำระเงิน

→ รอตรวจสอบการชำระเงิน

→ ชำระเงินแล้ว

→ เตรียมรับนักเรียน

→ เสร็จสิ้น

18. Database

ใช้ MySQL

ตารางหลัก

account

* account_id

* firstname

* lastname

* email

* password

* role

course

* course_id

* course_name

* language_level

application

* application_id

* account_id

* course_id

* agent_id

* status

* submitted_date

payment

* payment_id

* application_id

* amount

* date_time

* status

agent

* agent_id

* account_id

* agent_status

สร้างตารางเพิ่มเติมสำหรับ

* ผลสอบภาษา

* ความสนใจของ Student

* เอกสาร

* Offer

* Invoice

* Notification

โดยกำหนดความสัมพันธ์ระหว่างตารางให้เหมาะสม

19. หน้าหลักของเว็บไซต์

หน้าสำหรับผู้ที่ยังไม่ได้ Login

* Home

* Courses

* About

* Contact

* Login

* Register

Student

* Dashboard

* Profile

* Study Interests

* Language Test

* Courses

* Course Details

* Apply

* My Applications

* Documents

* Offer

* Invoice

* Payment

* Notifications

Agent

* Dashboard

* Applications

* Application Details

* Documents

* Offers

* Payments

* Notifications

College

* Dashboard

* Applications

* Application Details

* Documents

* Offers

* Payments

* Notifications

20. Design

ใช้สีหลักเป็นสีแดงและสีขาว

เว็บไซต์ต้องดูเป็นเว็บไซต์เอเจนซี่ศึกษาต่อประเทศแคนาดา

ออกแบบให้

* ใช้งานง่าย

* ดูเป็นมืออาชีพ

* อ่านข้อมูลได้ง่าย

* Responsive

* รองรับ Desktop

* รองรับ Tablet

* รองรับ Mobile

ใช้ Card สำหรับ Course

ใช้ Table สำหรับ Application และ Payment

ใช้ Status สำหรับแสดงสถานะ

ใช้ Form สำหรับกรอกข้อมูล

ใช้ File Upload สำหรับเอกสาร

21. Security

* Password ต้องถูก Hash ก่อนบันทึกใน Database

* แยกสิทธิ์ตาม Role

* Student เห็นเฉพาะข้อมูลของตัวเอง

* Agent เห็นเฉพาะ Application ที่เกี่ยวข้อง

* College เห็นเฉพาะ Application ที่ถูกส่งมา

* ตรวจสอบไฟล์ก่อน Upload

* ตรวจสอบข้อมูลจาก Form

* ไม่ส่ง Password ไปยัง Frontend

22. Workflow

Student สมัครสมาชิก

Student Login

Student กรอกข้อมูลความสนใจ

Student กรอกผลสอบภาษา ถ้ามี

ระบบแนะนำ Course

ระบบตรวจระดับภาษา

ระบบแสดง Course ที่สามารถสมัครได้

Student เลือก Course

ระบบแสดงเอกสารที่ต้องใช้

Student Upload เอกสาร

ระบบตรวจว่าเอกสารครบหรือไม่

Student Submit Application

ระบบแจ้ง Agent

Agent ตรวจสอบ Application

ระบบแสดงข้อมูลและผลการตรวจสอบเบื้องต้น

ถ้าไม่ถูกต้อง Agent ส่งกลับให้ Student

ถ้าถูกต้อง Agent ส่ง Application ให้ College

ระบบแจ้ง College

College ตรวจสอบ Application

College ออก Offer และ Invoice

ระบบแจ้ง Agent

Agent ส่ง Offer และ Invoice ให้ Student ผ่านระบบ

ระบบแจ้ง Student

Student ชำระเงิน

Student Upload Payment Proof

ระบบตรวจสอบจำนวนเงินเบื้องต้น

Agent ตรวจสอบ Payment Proof

ถ้าไม่ถูกต้อง ส่งกลับ Student

ถ้าถูกต้อง ส่งให้ College

College ตรวจสอบ Payment

ระบบเปลี่ยนสถานะ

เตรียมรับนักเรียน

เสร็จสิ้น

23. สิ่งที่ต้องสร้าง

สร้างระบบให้สามารถทำงานตาม Requirements ทั้งหมด

ต้องมี

* Frontend

* Backend

* MySQL Database

* Login

* Register

* Role Permission

* Student Dashboard

* Agent Dashboard

* College Dashboard

* Course Matching

* Language Requirement Check

* Document Management

* Application Management

* Offer Management

* Invoice Management

* Payment Management

* Notification

* Application Status

* ระบบตรวจสอบอัตโนมัติที่ช่วยลดงาน Manual

สร้าง SQL สำหรับ Database และข้อมูลตัวอย่างสำหรับทดสอบระบบ

สร้างไฟล์ที่จำเป็นสำหรับ Next.js Project

อธิบายวิธีติดตั้งและวิธี Run Project ใน VS Code

โค้ดต้องสามารถนำไปใช้งานได้จริง และไม่เพิ่ม Framework หรือ Technology ที่ไม่จำเป็น

โดยขึ้นเว็บมาให้ครบก่อนแล้วเรื่องหลังบ้านค่อยทำทีหลัง เอาตัวเว็บมาพร้อมโค้ดก่อน

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://canada-study-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ca177774-bb47-423b-932f-f0c63fe1c83f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
