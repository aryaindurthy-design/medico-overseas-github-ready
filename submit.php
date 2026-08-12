<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'message'=>'Method not allowed']); exit; }
$raw=file_get_contents('php://input'); $data=json_decode($raw,true); if(!is_array($data)){$data=$_POST;}
function clean($v,$max=500){$v=trim(strip_tags((string)$v));return substr($v,0,$max);}
$name=clean($data['name']??'',120); $phone=clean($data['phone']??'',40); $email=clean($data['email']??'',160); $city=clean($data['city']??'',120); $country=clean($data['country']??'',80); $neet=clean($data['neet_score']??'',10); $message=clean($data['message']??'',1200); $page=clean($data['page']??'',500);
if(strlen($name)<2 || !preg_match('/^[0-9+()\-\s]{10,18}$/',$phone)){http_response_code(422);echo json_encode(['ok'=>false,'message'=>'Please enter a valid name and phone number']);exit;}
if($email!==''&&!filter_var($email,FILTER_VALIDATE_EMAIL)){http_response_code(422);echo json_encode(['ok'=>false,'message'=>'Please enter a valid email']);exit;}
if($neet!==''&&!preg_match('/^[0-9]{1,3}$/',$neet)){http_response_code(422);echo json_encode(['ok'=>false,'message'=>'NEET score must contain only 1 to 3 digits']);exit;}
$dir=__DIR__.'/storage'; if(!is_dir($dir)){@mkdir($dir,0755,true);} $file=$dir.'/leads.csv'; $new=!file_exists($file); $fp=@fopen($file,'a');
if(!$fp){http_response_code(500);echo json_encode(['ok'=>false,'message'=>'Lead storage is not writable']);exit;}
if($new){fputcsv($fp,['submitted_at','name','phone','email','city','country','neet_score','message','page','ip']);}
fputcsv($fp,[date('c'),$name,$phone,$email,$city,$country,$neet,$message,$page,$_SERVER['REMOTE_ADDR']??'']); fclose($fp);
$to='info@medicooverseas.com'; $subject='New Medico Overseas website enquiry';
$body="Name: $name\nPhone: $phone\nEmail: $email\nCity: $city\nCountry: $country\nNEET: $neet\nMessage: $message\nPage: $page";
$host=preg_replace('/[^a-z0-9.-]/i','',$_SERVER['HTTP_HOST']??'medicooverseas.com'); $headers="From: website@$host\r\nReply-To: ".($email?:'info@medicooverseas.com'); @mail($to,$subject,$body,$headers);
echo json_encode(['ok'=>true,'message'=>'Enquiry saved']);
?>